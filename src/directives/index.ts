import wave from "@/directives/wave.ts";
import copy from "@/directives/copy.ts";

const registerDirective = (app:any)=>{
    app.directive('wave',wave)
    app.directive('copy',copy)
}

export default registerDirective