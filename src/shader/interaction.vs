#ifdef GL_ES
  precision mediump float;
#endif

#define halfPi 1.57079632679

attribute vec4 aPosition;
attribute vec3 aID;
attribute vec4 aColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;
uniform mat4 uMatrix;

uniform float uFogRadius;

varying vec4 vColor;

uniform float uBendRadius;
uniform float uBendDistance;

void main() {

  if (aColor.a == 0.0) {
    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
    vColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {

    //*** bending ***************************************************************

  //  vec4 mwPosition = uViewMatrix * uModelMatrix * aPosition;
  //
  //  float innerRadius = uBendRadius + mwPosition.y;
  //  float depth = abs(mwPosition.z);
  //  float s = depth-uBendDistance;
  //  float theta = min(max(s, 0.0)/uBendRadius, halfPi);
  //
  //  // halfPi*uBendRadius, not halfPi*innerRadius, because the "base" of a building
  //  // travels the full uBendRadius path
  //  float newY = cos(theta)*innerRadius - uBendRadius - max(s-halfPi*uBendRadius, 0.0);
  //  float newZ = normalize(mwPosition.z) * (min(depth, uBendDistance) + sin(theta)*innerRadius);
  //
  //  vec4 newPosition = vec4(mwPosition.x, newY, newZ, 1.0);
  //  gl_Position = uProjMatrix * newPosition;

    gl_Position = uMatrix * aPosition;

    vec4 mPosition = vec4(uModelMatrix * aPosition);
    float distance = length(mPosition);

    if (distance > uFogRadius) {
      vColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
      vColor = vec4(aID.xyz, 1.0);
    }
  }
}
