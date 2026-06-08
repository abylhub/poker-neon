// Run: node scripts/gen-icons.js
// Generates PWA icons from SVG using canvas

import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#07050f'
  ctx.fillRect(0, 0, size, size)

  // Border glow
  ctx.strokeStyle = '#ffd700'
  ctx.lineWidth = size * 0.02
  ctx.globalAlpha = 0.4
  ctx.strokeRect(size*0.05, size*0.05, size*0.9, size*0.9)
  ctx.globalAlpha = 1

  // Inner glow
  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  grad.addColorStop(0, 'rgba(255,45,120,0.2)')
  grad.addColorStop(1, 'rgba(7,5,15,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // Spade ♠
  ctx.fillStyle = '#ffd700'
  ctx.shadowColor = '#ffd700'
  ctx.shadowBlur = size * 0.08
  ctx.font = `${size * 0.55}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('♠', size/2, size/2 - size*0.04)

  // "PL" text
  ctx.shadowBlur = 0
  ctx.fillStyle = 'rgba(255,45,120,0.8)'
  ctx.font = `bold ${size * 0.14}px sans-serif`
  ctx.fillText('POKER', size/2, size * 0.82)

  return canvas.toBuffer('image/png')
}

writeFileSync('public/icon-192.png', drawIcon(192))
writeFileSync('public/icon-512.png', drawIcon(512))
console.log('Icons generated: public/icon-192.png, public/icon-512.png')
