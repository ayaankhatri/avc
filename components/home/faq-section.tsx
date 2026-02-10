import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How effective is ResQ?",
    answer:
      "ResQ is highly effective in monitoring worker safety in real time. It continuously tracks environmental conditions and the worker's status, enabling early detection of potential hazards and allowing quick action to prevent accidents.",
  },
  {
    question: "What is the return or exchange policy?",
    answer:
      "We offer a 7-day return or exchange policy from the date of delivery. The product must be returned in its original condition and packaging to be eligible.",
  },
  {
    question: "How does the sensor work?",
    answer:
      "The helmet is equipped with advanced sensors that continuously monitor sudden changes in accelertion, surrounding gases, and location. If the system detects a hazardous condition that may put the worker at risk, the helmet immediately sends an alert to the SOS system and the contractor who assigned the helmet, enabling rapid response and assistance.",
  },
  {
    question: "What kind of hazards can the helmet detect?",
    answer:
      "The helmet can detect harmful gas presence, sudden falls or accidents, and location-based risks that may indicate danger to the worker.",
  },
  {
    question: "What happens if the sensor is damaged?",
    answer:
      "If the sensor is damaged or detects unsafe conditions, it is marked as a danger alert in the system, and the contractor is immediately notified with relevant details.",
  },
]

export function FaqSection() {
  return (
    <section className="px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Everything you need to know about ResQ smart helmets.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}