type AudioResource = { context: AudioContext; source?: AudioBufferSourceNode; gain?: GainNode };

/** Own pending and playing audio together so cancellation cannot leak a context. */
export function createAmbienceEngine(createContext = () => new AudioContext()) {
  let resource: AudioResource | null = null;
  let generation = 0;
  let level = 0;
  const release = (audio: AudioResource) => {
    try {
      audio.source?.stop();
    } catch {
      /* A failed start may leave an unstarted source. */
    }
    void audio.context.close().catch(() => {});
  };
  const stop = () => {
    generation++;
    if (resource) {
      const audio = resource;
      resource = null;
      release(audio);
    }
  };
  const setLevel = (value: number) => {
    level = value;
    if (resource?.gain)
      resource.gain.gain.setTargetAtTime(level, resource.context.currentTime, 0.2);
  };
  return {
    get active() {
      return resource !== null;
    },
    stop,
    setLevel,
    async start(): Promise<"started" | "cancelled" | "failed"> {
      stop();
      const request = generation;
      let audio: AudioResource | undefined;
      try {
        audio = { context: createContext() };
        resource = audio;
        const context = audio.context;
        await context.resume();
        if (request !== generation) return "cancelled";
        if (context.state !== "running") throw new Error("Audio was blocked");
        const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 650;
        const gain = context.createGain();
        gain.gain.value = level;
        audio.source = source;
        audio.gain = gain;
        source.connect(filter).connect(gain).connect(context.destination);
        source.start();
        return "started";
      } catch {
        if (request !== generation) return "cancelled";
        if (resource === audio) {
          resource = null;
          if (audio) release(audio);
        }
        return "failed";
      }
    },
  };
}
