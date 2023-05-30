"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return createActionProxy;
    }
});
function createActionProxy(id, bound, action, originalAction) {
    action.$$typeof = Symbol.for("react.server.reference");
    action.$$id = id;
    action.$$bound = bound;
    action.bind = function(_, ...boundArgs) {
        const newAction = async function(...args) {
            if (originalAction) {
                return originalAction(newAction.$$bound.concat(args));
            } else {
                // In this case we're calling the user-defined action directly.
                return action(...newAction.$$bound, ...args);
            }
        };
        for (const key of [
            "$$typeof",
            "$$id",
            "$$FORM_ACTION"
        ]){
            // @ts-ignore
            newAction[key] = action[key];
        }
        // Rebind args
        newAction.$$bound = (action.$$bound || []).concat(boundArgs);
        return newAction;
    };
}

//# sourceMappingURL=action-proxy.js.map