// components
const COMPONENTS = {
  input(fieldName, storage) {
    return `<div x-data="$f('${fieldName}', '${storage}')" class="container" x-show="visible">
      <input x-model="value" :readonly="readonly">
    </div>`;
  },
  storageFieldInfo(fieldName, storage) {
    return `<ul x-data="$f('${fieldName}', '${storage}')">
      <li><p>value</p><b x-text="value"></b></li>
      <li><p>readonly</p><b x-text="readonly"></b></li>
      <li><p>visible</p><b x-text="visible"></b></li>
      <li><p>disabled</p><b x-text="disabled"></b></li>
    </ul>`;
  },

  checkbox(fieldName, storage) {
    return `
      <label x-data="$f('${fieldName}', '${storage}')"  x-show="visible">
        <input type="checkbox" x-model="value" :disabled="disabled" />
        <span x-text="label"></span>
      </label>
    `;
  },

  radio(fieldName, storage) {
    return `
      <div class="radio-group" x-data="$f('${fieldName}', '${storage}')" x-show="visible">
        <template x-for="(opt, idx) in options" :key="opt.value || idx">
          <label class="radio-option">
            <input type="radio" x-model="value" :value="opt.value" :disabled="disabled" />
            <span x-text="opt.label || opt.name"></span>
          </label>
        </template>
        <span x-show="!options?.length" class="empty-options">No options</span>
      </div>
    `;
  },
};

// storage
document.addEventListener("alpine:init", () => {
  Alpine.store("storeExample", {
    name: "Alexander",
    subname: "Taimasov",

    checkbox: false,
    choise: "1",
  });
});

// OPTIONAL

// SCHEMAS
const FIELD_SCHEMAS = {
  name: {
    readonly() {
      return this.store.checkbox === true;
    },
  },
  subname: {
    visible() {
      return this.store.checkbox === true;
    },
  },
  checkbox: {
    visible: true,
    disabled() {
      return this.store.name === "";
    },
    label: "show subname",
  },
  choise: {
    options() {
      const arr = [
        { value: "1", name: "choise №1" },
        { value: "2", name: "choise №2" },
      ];

      if (this.store.checkbox === true) {
        arr.push({ value: "3", name: "choise №3 (checkbox active)" });
      } else {
        arr.push({ value: "4", name: "choise №4 (checkbox unactive)" });
        arr.push({ value: "5", name: "choise №5 (checkbox unactive)" });
      }

      return arr;
    },
  },
};

const DEFAULT_RULES = {
  visible: true,
  readonly: false,
  disabled: false,
  label: "",
};

// field helper
document.addEventListener("alpine:init", () => {
  Alpine.magic("f", () => {
    return (fieldName, storage) => {
      const store = Alpine.store(storage);
      const schema = FIELD_SCHEMAS[fieldName] ?? {};

      const ctx = { store };
      const result = {
        get value() {
          return store[fieldName];
        },
        set value(v) {
          store[fieldName] = v;
        },
      };

      const applyRule = (name, rule) => {
        Object.defineProperty(result, name, {
          get: typeof rule === "function" ? () => rule.call(ctx) : () => rule,
          enumerable: true,
          configurable: true,
        });
      };

      Object.entries(DEFAULT_RULES).forEach(([k, v]) => applyRule(k, v));
      Object.entries(schema).forEach(([k, v]) => applyRule(k, v));

      return result;
    };
  });
});
