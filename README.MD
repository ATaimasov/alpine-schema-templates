## English

### What it is

This project leverages Alpine.js to generate reactive templates + uses a field schema system. No extra dependencies, no bundlers, no Virtual DOM. Core logic is ~200 lines (excluding template strings and the framework itself). Perfect for quickly embedding a reactive templating system where none exists — especially in legacy codebases.

### How it works

- **`$f(fieldName, store)`** – Magic helper that creates a reactive context with getters/setters bound directly to `Alpine.store()`.
- **`FIELD_SCHEMAS`** – Simple object to override rules per field (e.g., `readonly() { return this.store.checkbox }`).
- **`x-t` directive** – Parses the expression, injects HTML, distributes slots via `DocumentFragment`, swaps the DOM node, and safely calls `Alpine.initTree()`.

### Quick Start

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"
></script>
<script src="x-t.js"></script>
<script src="scripts.js"></script>

<!-- Input bound to store.name -->
<div x-t="COMPONENTS.input('name', 'storeExample')"></div>

<!-- Checkbox with slotted content -->
<div x-t="COMPONENTS.checkbox('checkbox', 'storeExample')">
  <span x-slot>Show subname</span>
</div>

<!-- Radio group with dynamic options -->
<div x-t="COMPONENTS.radio('choise', 'storeExample')"></div>
```

MIT License.

---

## Русский

### Что это

Проект реализует возможности Alpine.js для генерации реактивных шаблонов + использует схему полей. Никаких лишних зависимостей, никаких сборщиков, виртуального DOM. Код на ~200 строк, если не считать сами шаблоны и фреймворк. Подойдет для быстрого встраивания шаблонизатора с реактивностью там, где его нет, особенно в легаси системах.

### Как это работает

- **`$f(fieldName, store)`** – магический хелпер, создающий реактивный контекст с геттерами/сеттерами к `Alpine.store()`.
- **`FIELD_SCHEMAS`** – объект с переопределением правил для конкретных полей (например, `readonly() { return this.store.checkbox }`).
- **Директива `x-t`** – парсит выражение, вставляет HTML, раскидывает слоты через `DocumentFragment`, заменяет DOM-узел и вызывает `Alpine.initTree()`.

### Быстрый старт

```html
<script
  defer
  src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"
></script>
<script src="x-t.js"></script>
<script src="scripts.js"></script>

<!-- Инпут, привязанный к store.name -->
<div x-t="COMPONENTS.input('name', 'storeExample')"></div>

<!-- Чекбокс с контентом в слоте -->
<div x-t="COMPONENTS.checkbox('checkbox', 'storeExample')">
  <span x-slot>Показать подимя</span>
</div>

<!-- Группа радиокнопок с динамическими опциями -->
<div x-t="COMPONENTS.radio('choise', 'storeExample')"></div>
```

MIT License.
