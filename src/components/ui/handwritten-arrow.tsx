import { motion } from "framer-motion"

export function HandwrittenArrow() {
  return (
    <div className="flex justify-center -mt-[var(--sp-12)] mb-[var(--sp-12)]">
      <svg width="50" height="220" viewBox="0 0 50 220" fill="none">
        {/* Main shaft — wobbly curve, drawn top-to-bottom */}
        <motion.path
          d="M25 2 C28 30, 16 55, 23 85 C30 115, 15 150, 25 195"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Arrowhead left — slightly asymmetric */}
        <motion.path
          d="M16 178 L25 200"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.9 }}
        />
        {/* Arrowhead right */}
        <motion.path
          d="M35 180 L25 200"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.95 }}
        />
      </svg>
    </div>
  )
}
