/**
 * A very soft "swish" with a tiny tick, synthesised with Web Audio, so there
 * is no audio file to download. Only ever called from a click or swipe, which
 * is what browsers require before a page may make sound.
 */
let ctx: AudioContext | null = null

export function swish(direction: 1 | -1 = 1) {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === "suspended") void ctx.resume()
    const t = ctx.currentTime

    // air: 0.24s of noise through a band-pass that falls, panned in the direction of travel
    const len = Math.floor(ctx.sampleRate * 0.24)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.Q.value = 0.8
    band.frequency.setValueAtTime(2600, t)
    band.frequency.exponentialRampToValueAtTime(650, t + 0.22)
    const air = ctx.createGain()
    air.gain.setValueAtTime(0.0001, t)
    air.gain.exponentialRampToValueAtTime(0.045, t + 0.05)
    air.gain.exponentialRampToValueAtTime(0.0001, t + 0.24)
    const pan = ctx.createStereoPanner()
    pan.pan.setValueAtTime(-0.35 * direction, t)
    pan.pan.linearRampToValueAtTime(0.35 * direction, t + 0.22)
    noise.connect(band).connect(air).connect(pan).connect(ctx.destination)
    noise.start(t)
    noise.stop(t + 0.25)

    // tick: a short, quiet click at the start
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(1700, t)
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.03)
    const tick = ctx.createGain()
    tick.gain.setValueAtTime(0.02, t)
    tick.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
    osc.connect(tick).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.05)
  } catch {
    // no Web Audio (old browser, blocked): stay silent
  }
}
