// @ts-ignore
import Waveform from 'waveform-node'

export async function getAudioWaveForm(path: string) {
    Waveform.getWaveForm(path, {}, function (error:Error, peaks:any) {
        if (error) {
            return;
        }

        // Get peaks
        console.log(peaks);
    })
}