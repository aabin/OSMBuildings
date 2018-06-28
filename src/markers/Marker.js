class Marker {

  constructor (options = {}) {
    this.position = { altitude: 0, ...options.position };
    this.anchor = options.anchor || 'bottom';
    this.scale = options.scale || 1; // TODO -> size

options.url = '../src/icons/default.svg';

    this.load(options.url);
  }

  load (url) {
    if (!url) {
      console.log('loading default icon');
      this.loadDefaultIcon();
      return;
    }

    const icon = new Icon();
    // TODO: or get it from iconcollection
    icon.load(url, () => {

    //   if (!image) {
    //     console.log(`can't read marker icon ${url}`);
    //     this.loadDefaultIcon();
    //     return;
    //   }
    //
    //   this.setTexture(image);
    //   this.setBuffers();
    //   APP.markers.add(this);
    });
  }

  loadDefaultIcon () {
    this.texture = new GLX.texture.Image();
    this.texture.load(MARKER_TEXTURE).then(image => {
      this.setTexture(image);
      this.setBuffers();
      APP.markers.add(this);
    });
  }

  setTexture (image) {
    // Whole texture will be mapped to fit the tile exactly.
    // So don't attempt to wrap around the texture coordinates.

    GL.pixelStorei(GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    GL.bindTexture(GL.TEXTURE_2D, this.texture.id);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR); // fit texture to vertex

    this.size = image.width / 20 * this.scale;
    // this.size = image.width / 100 * this.scale; // for default icon?
  }

  setBuffers () {
    const texCoords = [
      0, 0,
      1, 0,
      0, 1,
      1, 1,
      0, 1,
      1, 0
    ];

    const halfSize = this.size / 2;
    const anchorsCoordPool = {
      center: [halfSize, halfSize, halfSize, halfSize],
      top: [0, halfSize, this.size, halfSize],
      bottom: [this.size, halfSize, 0, halfSize],
      left: [halfSize, 0, halfSize, this.size],
      right: [halfSize, this.size, halfSize, 0],
      top_left: [0, 0, this.size, this.size],
      top_right: [0, this.size, this.size, 0],
      bottom_left: [this.size, -this.size, 0, 0],
      bottom_right: [this.size, this.size, 0, 0]
    };

    const anchorCoord = anchorsCoordPool[this.anchor] || anchorsCoordPool.center;

    const vertices = [
      -anchorCoord[1], -anchorCoord[0], 0, // upper left
       anchorCoord[3], -anchorCoord[0], 0, // upper right
      -anchorCoord[1],  anchorCoord[2], 0, // bottom left
       anchorCoord[3],  anchorCoord[2], 0, // bottom right
      -anchorCoord[1],  anchorCoord[2], 0, // bottom left
       anchorCoord[3], -anchorCoord[0], 0  // upper right
    ];

    this.texCoordBuffer = new GLX.Buffer(2, new Float32Array(texCoords));
    this.vertexBuffer = new GLX.Buffer(3, new Float32Array(vertices));
  }

  destroy () {
    APP.markers.remove(this);
    this.texCoordBuffer && this.texCoordBuffer.destroy();
    this.vertexBuffer && this.vertexBuffer.destroy();
    this.texture && this.texture.destroy();
  }
}
