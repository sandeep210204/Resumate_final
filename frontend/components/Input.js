// Input helpers for consistent label + input structure

export function createLabeledInput(id, label, { type = 'text', placeholder = '', helper } = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'field-label';
  labelEl.htmlFor = id;
  labelEl.textContent = label;

  const input = document.createElement('input');
  input.id = id;
  input.type = type;
  input.placeholder = placeholder;

  wrapper.appendChild(labelEl);
  wrapper.appendChild(input);

  if (helper) {
    const helperEl = document.createElement('div');
    helperEl.className = 'field-helper';
    helperEl.textContent = helper;
    wrapper.appendChild(helperEl);
  }

  return { wrapper, input };
}

export function createTextArea(id, label, { placeholder = '', helper } = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-row';

  const labelEl = document.createElement('label');
  labelEl.className = 'field-label';
  labelEl.htmlFor = id;
  labelEl.textContent = label;

  const textarea = document.createElement('textarea');
  textarea.id = id;
  textarea.placeholder = placeholder;

  wrapper.appendChild(labelEl);
  wrapper.appendChild(textarea);

  if (helper) {
    const helperEl = document.createElement('div');
    helperEl.className = 'field-helper';
    helperEl.textContent = helper;
    wrapper.appendChild(helperEl);
  }

  return { wrapper, textarea };
}


