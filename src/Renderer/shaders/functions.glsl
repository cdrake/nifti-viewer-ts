vec4 drawColor(float scalar) {
    float nlayer = float(textureSize(colormap, 0).y);
    float layer = (nlayer - 0.5) / nlayer;
    vec4 dcolor = texture(colormap, vec2(scalar * 255.0 / 256.0 + 0.5 / 256.0, layer)).rgba;
    dcolor.a *= drawOpacity;
    return dcolor;
}

vec3 GetBackPosition(vec3 startPositionTex) {
    vec3 startPosition = startPositionTex * volScale;
    vec3 invR = 1.0 / rayDir;
    vec3 tbot = invR * (vec3(0.0) - startPosition);
    vec3 ttop = invR * (volScale - startPosition);
    vec3 tmax = max(ttop, tbot);
    vec2 t = min(tmax.xx, tmax.yz);
    vec3 endPosition = startPosition + (rayDir * min(t.x, t.y));
	//convert world position back to texture position:
    endPosition = endPosition / volScale;
    return endPosition;
}

vec4 applyClip(vec3 dir, inout vec4 samplePos, inout float len, inout bool isClip) {
    float cdot = dot(dir, clipPlane.xyz);
    isClip = false;
    if((clipPlane.a > 1.0) || (cdot == 0.0))
        return samplePos;
    bool frontface = (cdot > 0.0);
    float clipThick = 2.0;
    float dis = (-clipPlane.a - dot(clipPlane.xyz, samplePos.xyz - 0.5)) / cdot;
    float disBackFace = (-(clipPlane.a - clipThick) - dot(clipPlane.xyz, samplePos.xyz - 0.5)) / cdot;
    if(((frontface) && (dis >= len)) || ((!frontface) && (dis <= 0.0))) {
        samplePos.a = len + 1.0;
        return samplePos;
    }
    if(frontface) {
        dis = max(0.0, dis);
        samplePos = vec4(samplePos.xyz + dir * dis, dis);
        if(dis > 0.0)
            isClip = true;
        len = min(disBackFace, len);
    }
    if(!frontface) {
        len = min(dis, len);
        disBackFace = max(0.0, disBackFace);
        if(len == dis)
            isClip = true;
        samplePos = vec4(samplePos.xyz + dir * disBackFace, disBackFace);
    }
    return samplePos;
}

float frac2ndc(vec3 frac) {
//https://stackoverflow.com/questions/7777913/how-to-render-depth-linearly-in-modern-opengl-with-gl-fragcoord-z-in-fragment-sh
    vec4 pos = vec4(frac.xyz, 1.0); //fraction
    vec4 dim = vec4(vec3(textureSize(volume, 0)), 1.0);
    pos = pos * dim;
    vec4 shim = vec4(-0.5, -0.5, -0.5, 0.0);
    pos += shim;
    vec4 mm = transpose(matRAS) * pos;
    float z_ndc = (mvpMtx * vec4(mm.xyz, 1.0)).z;
    return (z_ndc + 1.0) / 2.0;
}
