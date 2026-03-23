export function applyMixins(baseClass, mixins = []) {
    return mixins.reduce((cls, mixin) => mixin(cls), baseClass);
}
