import wave from "@/directives/wave.ts";
import {CreateAppFunction} from "vue";

const registerDirective = (app:any)=>{
    app.directive('wave',wave)
}

export default registerDirective