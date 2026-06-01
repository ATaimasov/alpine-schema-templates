/**
 * x-template directive
 * Generates HTML from TemplatesKit and applies Alpine init to it.
 * Allows inserting other templates inside (similar to v-slot), which will be executed recursively.
 *
 * Use <slot></slot> in templatesKit for precise template positioning.
 *
 * @type {string}
 */
document.addEventListener("alpine:init", () => {
  Alpine.directive("t", (el, { expression }, { evaluate }) => {
    // 1. Save child elements, filtering out empty text nodes
    const children = Array.from(el.childNodes).filter(
      (node) => !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim()),
    );

    // 2. Group children by named slots (slot="name" or x-slot="name")
    const slotGroups = {};
    children.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const name =
          child.getAttribute("slot") ||
          child.getAttribute("x-slot") ||
          "default";
        (slotGroups[name] ||= []).push(child);
      } else {
        (slotGroups["default"] ||= []).push(child);
      }
    });

    // 3. Generate HTML
    const html = evaluate(expression);
    if (!html) return;

    const temp = document.createElement("div");
    temp.innerHTML = html.trim();
    const newEl = temp.firstElementChild;
    if (!newEl) return;

    // 4. Copy custom attributes from the original element to the new one
    for (const attr of el.attributes) {
      if (!attr.name.startsWith("x-t")) {
        newEl.setAttribute(attr.name, attr.value);
      }
    }

    // 5. Distribute elements into slots in the template
    const slotMarkers = Array.from(newEl.querySelectorAll("slot, [x-slot]"));
    const processed = new Set();

    slotMarkers.forEach((marker) => {
      const name = marker.getAttribute("name") || "default";
      if (processed.has(name)) return; // protect against duplicate slots

      const items = slotGroups[name];
      if (items?.length) {
        // Use DocumentFragment to preserve original order and performance
        const fragment = document.createDocumentFragment();
        items.forEach((item) => {
          // Clean up slot attributes after distribution (not needed in final DOM)
          item.removeAttribute("slot");
          item.removeAttribute("x-slot");
          fragment.appendChild(item);
        });
        marker.parentNode.insertBefore(fragment, marker);
        processed.add(name);
      }
      // Remove the slot marker
      marker.remove();
    });

    // 6. Fallback: append undistributed elements to the end of the container
    Object.keys(slotGroups).forEach((name) => {
      if (!processed.has(name)) {
        const fragment = document.createDocumentFragment();
        slotGroups[name].forEach((item) => fragment.appendChild(item));
        newEl.appendChild(fragment);
      }
    });

    // 7. Replace the original element with the generated one
    el.replaceWith(newEl);

    // 8. Safe Alpine initialization on the new tree
    queueMicrotask(() => {
      if (typeof Alpine.initTree === "function") {
        Alpine.initTree(newEl);
      } else {
        // Fallback for Alpine v2
        Alpine.init(newEl);
      }
    });
  });
});
