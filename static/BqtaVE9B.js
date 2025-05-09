import { p as pages } from "./CUPcO2LI.js";
import { d as defineComponent, t as useHead, H as setBlockTracking, A as createVNode, B as withCtx, y as createBaseVNode, v as openBlock, x as createElementBlock, J as renderList, G as unref, K as Fragment, F as createBlock, C as createTextVNode, z as toDisplayString } from "./CLygsIoC.js";
import { V as VContainer } from "./BfKDNlkB.js";
import { V as VCard, a as VCardTitle, b as VCardText } from "./CDB1RMSL.js";
import "./iovqoryD.js";
import "./CzYvQyrK.js";
const _hoisted_1 = { class: "d-flex flex-wrap justify-center ga-4 my-3" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  setup(__props) {
    useHead({
      title: "Probability Calculator"
    });
    return (_ctx, _cache) => {
      return _cache[0] || (setBlockTracking(-1, true), (_cache[0] = createVNode(VContainer, { class: "h-100 pa-0" }, {
        default: withCtx(() => [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "h-25 px-2 py-16 text-center bg-surface" }, [
            createBaseVNode("h2", { class: "text-h4 font-weight-black" }, " 機率計算機 ")
          ], -1)),
          createBaseVNode("div", _hoisted_1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(pages).slice(1), (page) => {
              return openBlock(), createBlock(VCard, {
                key: page.title,
                class: "d-flex flex-column",
                width: "400",
                to: page.path,
                color: "grey-lighten-4",
                variant: "elevated"
              }, {
                default: withCtx(() => [
                  createVNode(VCardTitle, {
                    tag: "h2",
                    class: "mb-2 py-1 font-weight-black"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(page.title), 1)
                    ]),
                    _: 2
                  }, 1024),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(page.description), 1)
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1032, ["to"]);
            }), 128))
          ])
        ]),
        _: 1
      })).cacheIndex = 0, setBlockTracking(1), _cache[0]);
    };
  }
});
export {
  _sfc_main as default
};
