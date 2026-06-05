import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="px-4 py-3 rounded-lg text-sm font-medium pointer-events-auto"
              style={t.type === 'error'
                ? { background: 'rgba(255,40,40,0.15)', border: '1px solid rgba(255,40,40,0.4)', color: '#ff6060' }
                : { background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.35)', color: '#00f5ff' }
              }>
              {t.type === 'success' ? '✓ ' : '✕ '}{t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
