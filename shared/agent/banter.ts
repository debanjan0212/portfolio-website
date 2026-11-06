/**
 * Mini-Debanjan's personality: greetings, light humour for off-topic
 * questions, and a care reply that always beats humour.
 *
 * Every line here is hand-written on purpose. A model asked to "be funny"
 * will eventually joke about the wrong thing; a fixed list can't. The jokes
 * are about servers, dashboards and the bot itself - never about the visitor,
 * their question, or any group of people.
 */

export type Mood = "wave" | "happy" | "talk" | "think" | "calm"

export const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

/** Distress or crisis. Checked before anything else, so it can never get a joke. */
const DISTRESS =
  /\b(suicid\w*|kill (my ?self|me)|end (my life|it all)|want to die|wanna die|self[- ]?harm|hurt(ing)? my ?self|can'?t go on|no reason to live|depress(ed|ion)|hopeless|panic attack)\b/i

export const isDistress = (text: string) => DISTRESS.test(text)

export const CARE_REPLY =
  "I'm only a portfolio help desk, but I'm really sorry you're going through this. Please talk to someone you trust, or a helpline. In India, Tele-MANAS is free and open 24x7 on 14416 (or 1800-891-4416). Anywhere else, your local emergency number can connect you to help."

/** "Are you a bot?", "are you really him?" - always answered honestly. */
const IDENTITY =
  /^\s*(who|what) (are|r) (you|u)\s*[?!.]*\s*$|\bare (you|u) (a )?(real|human|bot|ai|robot|debanjan)\b|\bis this (really )?(debanjan|him|a bot)\b/i

export const isIdentity = (text: string) => IDENTITY.test(text) && text.trim().split(/\s+/).length <= 8

export const IDENTITY_REPLY = [
  "I'm mini-Debanjan, an AI help desk Debanjan built for this site. I'm not him, just a pocket-sized version that only answers from his real profile. For the full-size one, email itsme.deb1995@gmail.com.",
  "Honest answer: I'm a bot. Debanjan built me so you can ask about his work any time, even at 3am when he's asleep and his alerts aren't. Want to try me?",
]

/** "Tell me a joke" gets an actual (clean, nerdy) joke. */
const JOKE_ASK = /\b(tell|say|crack|share)\b.*\bjoke\b|^\s*(a )?joke\??\s*$|\bmake me (laugh|smile)\b/i

export const isJokeRequest = (text: string) => JOKE_ASK.test(text)

export const JOKES = [
  "I'd tell you a DNS joke, but it might take 24 hours to reach you.",
  "I'd tell you a UDP joke, but you might not get it.",
  "There's no place like 127.0.0.1.",
  "Why don't SREs ever get lost? They always follow the trace.",
  "Why did the container leave the virtual machine? It wanted more space and less overhead.",
  "My uptime is 100%. My sense of humour is still in beta.",
]

export const AFTER_JOKE = "Now, something I'm actually good at:"

type TalkKind = "greet" | "namaste" | "timeofday" | "howareyou" | "thanks" | "bye" | "ack"

function talkKind(text: string): TalkKind {
  const t = text.toLowerCase()
  if (/namaste|namaskar/.test(t)) return "namaste"
  if (/good\s*(morning|afternoon|evening)/.test(t)) return "timeofday"
  if (/how\s*(are|r)\s*(you|u)|how'?s it going|what'?s up|\bsup\b/.test(t)) return "howareyou"
  if (/thank|cheers/.test(t)) return "thanks"
  if (/bye|see ya|goodbye/.test(t)) return "bye"
  if (/^\s*(ok(ay)?|cool|nice|great|awesome)\b/.test(t)) return "ack"
  return "greet"
}

const TALK: Record<TalkKind, string[]> = {
  greet: [
    "Hi! I'm mini-Debanjan, the pocket-sized help desk. The full-size one is busy keeping systems up, so ask me anything about his work:",
    "Hello! Mini-Debanjan here. Smaller than the original, same facts. What would you like to know?",
    "Hey there! I answer questions about Debanjan's work from his real profile. Where shall we start?",
  ],
  namaste: ["Namaste! I'm mini-Debanjan. Ask me anything about his work, or pick one of these:"],
  timeofday: ["{greeting} to you too! I'm mini-Debanjan. What would you like to know about his work?"],
  howareyou: [
    "All green on my dashboards, thanks for asking! What can I tell you about Debanjan?",
    "Running at full uptime and zero coffee. How can I help?",
  ],
  thanks: ["Happy to help! Anything else?", "Anytime. That's what help desks are for."],
  bye: [
    "Bye! May your pagers stay quiet.",
    "Take care! If you'd like to talk to the full-size Debanjan, he's at itsme.deb1995@gmail.com.",
  ],
  ack: ["Glad that helped. Want to dig into something else?"],
}

export function smallTalkReply(text: string): { message: string; mood: Mood } {
  const kind = talkKind(text)
  const greeting = text.match(/good\s*(morning|afternoon|evening)/i)?.[0] ?? ""
  const message = pick(TALK[kind]).replace(
    "{greeting}",
    greeting.charAt(0).toUpperCase() + greeting.slice(1).toLowerCase(),
  )
  return { message, mood: kind === "greet" || kind === "namaste" || kind === "bye" ? "wave" : "happy" }
}

/** Off-topic but harmless: a smile, then back to what it can answer. */
export const HUMOR = [
  "That question is outside my SLO. I only cover Debanjan's work, so my error budget for anything else is exactly zero. Try one of these:",
  "I checked every dashboard I have. Lots of graphs, no answer to that one. I'm much better at these:",
  "That request came back as a friendly 404. Not your fault, it's just not my service. Here's what I can help with:",
  "Great question, wrong help desk. This counter only handles Debanjan's work:",
  "I tried to route that one, but every agent I asked said \"not my service\". These ones they'd fight over:",
  "Even at 99.9% uptime, some questions land in the 0.1%. That's one of them. How about:",
  "If I guessed, I'd be hallucinating, and Debanjan built me specifically not to. Let's try one of these:",
  "My knowledge base is mostly Kubernetes, observability and one very patient engineer. That's not in it, but these are:",
]

/** Religion, politics, tragedy and the like: no jokes, just a polite redirect. */
export const SENSITIVE_REPLY =
  "That's not something I cover here. I stick to Debanjan's work and background. Here's what I can help with:"
