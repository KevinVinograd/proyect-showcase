import { motion, useReducedMotion } from "framer-motion"
import { VIEWPORT_MARGIN } from "@/lib/motion"

export function ZigzagDivider() {
  const reducedMotion = useReducedMotion()
  // Hand-drawn zigzag — irregular peaks for a natural, sketched feel
  const d =
    "M0 22 C4 22, 8 18, 14 4 C18 -4, 22 -2, 28 16 C32 28, 38 30, 44 6 " +
    "C48 -6, 54 -4, 58 14 C62 26, 68 28, 74 8 C78 -2, 84 -4, 88 12 " +
    "C92 24, 98 26, 104 10 C108 0, 114 -2, 118 14 C122 26, 128 28, 134 6 " +
    "C138 -6, 144 -4, 148 16 C152 30, 158 28, 164 8 C168 -4, 174 -2, 178 14 " +
    "C182 26, 188 24, 194 10 C198 0, 204 2, 208 16 C212 28, 218 26, 224 4 " +
    "C228 -6, 234 -4, 238 12 C242 24, 248 26, 254 8 C258 -2, 264 0, 268 14 " +
    "C272 26, 278 28, 284 6 C288 -6, 294 -4, 298 16 C302 30, 308 28, 314 10 " +
    "C318 -2, 324 0, 328 14 C332 26, 338 24, 344 4 C348 -8, 354 -4, 358 12 " +
    "C362 24, 368 26, 374 8 C378 -2, 384 0, 388 16 C392 28, 398 26, 404 6 " +
    "C408 -6, 414 -2, 418 14 C422 26, 428 28, 434 10 C438 0, 444 2, 448 16 " +
    "C452 28, 458 26, 464 4 C468 -8, 474 -4, 478 12 C482 24, 488 28, 494 8 " +
    "C498 -4, 504 -2, 508 14 C512 26, 518 24, 524 6 C528 -6, 534 -2, 538 16 " +
    "C542 28, 548 30, 554 10 C558 -2, 564 0, 568 14 C572 26, 578 24, 584 4 " +
    "C588 -8, 594 -4, 600 18"

  return (
    <div className="max-w-[var(--container-hero)] mx-auto px-[var(--sp-6)] pt-[160px] pb-0">
      <svg
        className="w-full overflow-visible"
        viewBox="0 0 600 32"
        fill="none"
      >
        {reducedMotion ? (
          <path
            d={d}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <motion.path
            d={d}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: VIEWPORT_MARGIN.decorative }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        )}
      </svg>
    </div>
  )
}
