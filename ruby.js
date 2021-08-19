class Ruby {

  static get isInline() {
    return true;
  }

  static get state() {
    return this._state;
  }

  static set state(newState) {
    console.log('setting: this._state = ', newState)
    console.log('setting: this._state = ', newState)
    console.log('setting: this._state = ', newState)
    console.log('setting: this._state = ', newState)
    this._state = newState
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({
    api
  }) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.baseTag = 'RUBY'
    this.subTag = 'RT';
    this.baseClass = 'cdx-ruby';
    this.subClass = 'cdx-rt';
  }

  render() { // called when user selected text
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.textContent = '読';
    // this.button.innerHTML = '<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2762 0L17 5.58621L8.54696 15L0 5.58621L3.00552 0H5.8232H8.64088H11.4586H14.2762Z" fill="#D3493F"/><path d="M14.2762 0L17 5.58621H11.4116H5.8232H0L3.00552 0L5.8232 5.58621L8.64088 0L11.4116 5.58621L14.2762 0Z" fill="#EC5F59"/><path d="M17 5.58618L8.54696 15L0 5.58618H5.8232L8.54696 15L11.4116 5.58618H17Z" fill="#B63831"/></svg>';
    this.button.classList.add(this.api.styles.inlineToolButton);
    this.button.classList.add('cdx-ruby__button');

    return this.button;
  }


  surround(range) { //called when user pressed the button
    if (this.state) {
      this.unwrap(range)
      return;
    }

    this.wrap(range)
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const ruby = document.createElement(this.baseTag);
    const rt = document.createElement(this.subTag);
    ruby.classList.add(this.baseClass);
    ruby.appendChild(selectedText);
    rt.appendChild(document.createTextNode('')); //temp
    rt.classList.add(this.subClass);
    ruby.appendChild(rt);
    range.insertNode(ruby);

    this.api.selection.expandToTag(ruby);
  }

  unwrap(range) {
    const foundTag = this.api.selection.findParentTag(this.baseTag, this.baseClass) || this.api.selection.findParentTag(this.subTag, this.subClass);

    if (foundTag.tagName === this.baseTag) {
      console.log('foundTag ruby:', foundTag);
      let rt = foundTag.querySelector('rt')
      if (rt) rt.remove();

      const text = foundTag.textContent;

      foundTag.remove();
      range.insertNode(document.createTextNode(text));
    } else {
      console.log('foundTag rt:', foundTag);
      let ruby = foundTag.parentElement;
      foundTag.remove();
      const text = ruby.textContent;
      ruby.remove();
      range.insertNode(text);
    }
  }

  renderActions() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-wrap-input');
    let hintText = document.createElement('span');
    hintText.classList.add('cdx-hint');
    hintText.innerText = '読み方:';
    this.wrapper.appendChild(hintText);
    this.subTextInput = document.createElement('input');
    this.subTextInput.type = 'text';
    this.subTextInput.placeholder = 'なになに';
    this.subTextInput.classList.add('cdx-rt__text');
    // this.subTextInput.hidden = true;
    this.wrapper.append(this.subTextInput);
    this.wrapper.hidden = true;
    return this.wrapper;
  }

  showActions(foundTag) {
    if(foundTag.tagName === this.baseTag) {
      let rt = foundTag.querySelector('rt')
      this.subTextInput.value = rt.textContent || '';
      this.subTextInput.oninput = () => {
        rt.textContent = this.subTextInput.value
      };
    } else if (foundTag.tagName === this.subTag) {
      this.subTextInput.oninput = () => {
        foundTag.textContent = this.subTextInput.value
      };
    }

    // this.subTextInput.hidden = false;
    this.wrapper.hidden = false;
  }

  hideActions() {
    this.subTextInput.oninput = null;
    this.wrapper.hidden = true;
  }

  checkState() { // called when user selected text, to check if the format is on
    let foundTag = this.api.selection.findParentTag(this.baseTag) || this.api.selection.findParentTag(this.subTag);
    console.log('check state is ', !!foundTag, ' ', foundTag)
    this.state = !!foundTag;

    if (this.state) {
      this.showActions(foundTag);
    } else {
      this.hideActions();
    }
  }

  static get sanitize() {
    return {
      ruby: {
        class: 'cdx-ruby'
      },
      rt: {
        class: 'cdx-rt'
      }
    };
  }
  static get shortcut() {
    return 'CMD+r'
  }
}