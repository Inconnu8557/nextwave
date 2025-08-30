import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, PenSquare, Users, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      to: '/create',
      icon: <PenSquare className="w-5 h-5" />,
      label: 'Créer un post',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      to: '/community/create',
      icon: <Users className="w-5 h-5" />,
      label: 'Nouvelle communauté',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      to: '/chat',
      icon: <MessageCircle className="w-5 h-5" />,
      label: 'Démarrer une conversation',
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  return (
    <div className="fixed bottom-20 right-6 md:bottom-8 z-40">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.to}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={action.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 ${action.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap`}
                >
                  {action.icon}
                  <span className="font-medium">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
