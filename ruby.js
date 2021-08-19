class Ruby {
  constructor({data, api}) {
    this.api = api;
    this.data = {
      url: data.url || '',
      caption: data.caption || '',
      withBorder: !!data.withBorder,
      withBackground: !!data.withBackground,
      stretched: !!data.stretched,
    };

    this.wrapper = undefined;
    this.settings = [
      {
        name: 'withBorder',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
      },
      {
        name: 'stretched',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
      },
      {
        name: 'withBackground',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
      }
    ];
  }
  static get toolbox(){
    return {
      title: 'Ruby',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2762 0L17 5.58621L8.54696 15L0 5.58621L3.00552 0H5.8232H8.64088H11.4586H14.2762Z" fill="#D3493F"/><path d="M14.2762 0L17 5.58621H11.4116H5.8232H0L3.00552 0L5.8232 5.58621L8.64088 0L11.4116 5.58621L14.2762 0Z" fill="#EC5F59"/><path d="M17 5.58618L8.54696 15L0 5.58618H5.8232L8.54696 15L11.4116 5.58618H17Z" fill="#B63831"/></svg>'
    }
  }
  renderSettings(){
    const wrapper = document.createElement('div');
    this.settings.forEach(tune => {
      console.log(tune.name,':', this.data[tune.name]);
      let button = document.createElement('div');

      button.classList.add('cdx-settings-button');

      button.classList.toggle('cdx-settings-button--active', this.data[tune.name])

      button.innerHTML = tune.icon;
      button.addEventListener('click', (event) => {
        console.log(event.target);
        this._toggleTune(tune.name);
        button.classList.toggle('cdx-settings-button--active');
      })
      wrapper.appendChild(button);
    });

    return wrapper;
  }
  _toggleTune(name) {
    console.log(name + " is being toggled");
    this.data[name] = !this.data[name];
    this._applySettingsToView();
  }
  _applySettingsToView() {
    this.settings.forEach( tune => {
      this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);

      //special api method
      if (tune.name === 'stretched') {
        this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
      }
    });
  }
  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('ruby-wrapper');

    if (this.data && this.data.url){
      this._createImage(this.data.url, this.data.caption);
      return this.wrapper;
    }

    const input = document.createElement('input');
    input.placeholder = 'Input a Url:'


    input.addEventListener('paste', (event) => {
      this._createImage(event.clipboardData.getData('text'));
    });
    this.wrapper.append(input);

    return this.wrapper;
  }

  _createImage(url, captionText='') {
    const image = document.createElement('img');
    const caption = document.createElement('div');

    image.src = url;
    caption.placeholder = 'Caption...';
    caption.innerHTML = captionText;
    caption.contentEditable = true;
    this.wrapper.innerHTML = '';
    this.wrapper.appendChild(image);
    this.wrapper.appendChild(caption);
    this._applySettingsToView()
  }

  save(blockContent) {
    let img = blockContent.querySelector('img');
    const caption = blockContent.querySelector('[contenteditable]');
    console.log(this.data);
    return Object.assign(this.data, {
      url: img.src,
      caption: caption.innerHTML || ''
    });
  }

  validate(savedData){
    if (!savedData.url.trim()){
      return false;
    }

    return true;
  }
}