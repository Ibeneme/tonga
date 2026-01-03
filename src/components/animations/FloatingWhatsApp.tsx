import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/booking";

export const FloatingWhatsApp = () => {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi! I'm interested in renting a scooter in Tonga.`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-palm text-primary-foreground px-5 py-3 rounded-full shadow-elevated hover:shadow-lg transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.4, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.div>
      <span className="font-medium hidden sm:block">Chat with us</span>

      {/* Pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full bg-palm"
        initial={{ opacity: 0.6, scale: 1 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    </motion.a>
  );
};
