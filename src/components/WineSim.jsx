import { useEffect, useRef } from 'react'
import p5 from 'p5'

export default function WineSim() {
  const containerRef = useRef(null)
  const fpsRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sketch = (p) => {
      const friction = 0.98
      const gravity = 0.5

      const dropSize = 30
      const cellSize = dropSize - 5
      const dropDist = cellSize + 7
      const mDropDist = dropDist + 40

      const isMobile = window.innerWidth < 768
      const maxDroplets = isMobile ? 500 : 1000
      const spawnDuration = 5000

      let posX, posY, velX, velY, forceX, forceY
      let cellHead, cellNext
      let gridCols = 0, gridRows = 0
      let dropletData

      function allocArrays() {
        posX = new Float32Array(maxDroplets)
        posY = new Float32Array(maxDroplets)
        velX = new Float32Array(maxDroplets)
        velY = new Float32Array(maxDroplets)
        forceX = new Float32Array(maxDroplets)
        forceY = new Float32Array(maxDroplets)
        cellNext = new Int32Array(maxDroplets)
        dropletData = new Float32Array(maxDroplets * 2)
        resizeGrid()
      }

      function resizeGrid() {
        gridCols = Math.ceil(p.width / cellSize)
        gridRows = Math.ceil(p.height / cellSize)
        cellHead = new Int32Array(gridCols * gridRows)
      }

      p.setup = async () => {
        wineShader = await p.loadShader('/wine.vert', '/wine.frag')
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
        p.pixelDensity(1)
        p.canvas.style.pointerEvents = 'none'
        startTime = p.millis()
        allocArrays()
      }

      let wineShader
      let count = 0
      let startTime = null
      let frames = 0
      let fpsAccum = 0

      p.draw = () => {
        p.background(219, 54, 5)

        const now = p.millis()
        const elapsed = now - startTime
        const target = elapsed < spawnDuration
          ? p.floor(p.map(elapsed, 0, spawnDuration, 0, maxDroplets))
          : maxDroplets

        while (count < target) {
          posX[count] = p.width / 2
          posY[count] = 0
          velX[count] = 0
          velY[count] = 0
          count++
        }

        // reset forces to gravity + clear spatial grid
        for (let i = 0; i < count; i++) {
          forceX[i] = 0
          forceY[i] = gravity
        }
        cellHead.fill(-1)

        // build spatial grid (linked list)
        for (let i = 0; i < count; i++) {
          const row = (posY[i] / cellSize) | 0
          const col = (posX[i] / cellSize) | 0
          const cell = row * gridCols + col
          cellNext[i] = cellHead[cell]
          cellHead[cell] = i
        }

        const dropDistSq = dropDist * dropDist

        // simulate: mouse repulsion + droplet neighborhood repulsion
        for (let i = 0; i < count; i++) {
          const x = posX[i]
          const y = posY[i]
          let fx = 0
          let fy = 0

          // mouse
          const mdx = x - p.mouseX
          const mdy = y - p.mouseY
          const mDistSq = mdx * mdx + mdy * mdy
          if (mDistSq < mDropDist * mDropDist && mDistSq > 0) {
            const mDist = Math.sqrt(mDistSq)
            const mStr = (mDropDist - mDist) / mDropDist
            fx += (mdx / mDist) * mStr * 1.25
            fy += (mdy / mDist) * mStr * 1.25
          }

          // neighbors
          const myRow = (y / cellSize) | 0
          const myCol = (x / cellSize) | 0
          for (let dr = -1; dr <= 1; dr++) {
            const r = myRow + dr
            if (r < 0 || r >= gridRows) continue
            for (let dc = -1; dc <= 1; dc++) {
              const c = myCol + dc
              if (c < 0 || c >= gridCols) continue
              let n = cellHead[r * gridCols + c]
              while (n !== -1) {
                if (n !== i) {
                  let dx = x - posX[n]
                  let dy = y - posY[n]
                  const distSq = dx * dx + dy * dy
                  if (distSq === 0) {
                    fx += p.random(-0.2, 0.2)
                    fy += p.random(-0.2, 0.2)
                  } else if (distSq < dropDistSq) {
                    const dist = Math.sqrt(distSq)
                    const str = (dropDist - dist) / dropDist
                    const push = (str * 0.5) / dist
                    fx += dx * push
                    fy += dy * push
                  }
                }
                n = cellNext[n]
              }
            }
          }

          forceX[i] += fx
          forceY[i] += fy
        }

        // integrate
        for (let i = 0; i < count; i++) {
          let vx = velX[i] + forceX[i]
          let vy = velY[i] + forceY[i]
          vx = Math.max(-7, Math.min(7, vx))
          vy = Math.max(-7, Math.min(7, vy))
          vx *= friction
          vy *= friction
          let x = posX[i] + vx
          let y = posY[i] + vy
          if (x <= 0 || x >= p.width) {
            vx *= -0.5
            x = Math.max(1, Math.min(p.width - 1, x))
          }
          if (y <= 0 || y >= p.height) {
            vy *= -0.5
            y = Math.max(1, Math.min(p.height - 1, y))
          }
          velX[i] = vx
          velY[i] = vy
          posX[i] = x
          posY[i] = y
        }

        // upload normalized positions + active count
        p.shader(wineShader)
        wineShader.setUniform('u_resolution', [p.width, p.height])
        for (let i = 0; i < count; i++) {
          dropletData[i * 2] = posX[i] / p.width
          dropletData[i * 2 + 1] = (p.height - posY[i]) / p.height
        }
        wineShader.setUniform('u_activeCount', count)
        wineShader.setUniform('u_droplets', dropletData)
        p.noStroke()
        p.rect(-p.width / 2, -p.height / 2, p.width, p.height)

        // FPS overlay
        frames++
        fpsAccum += p.deltaTime
        if (fpsAccum >= 500) {
          const fps = Math.round((frames * 1000) / fpsAccum)
          if (fpsRef.current) fpsRef.current.textContent = `FPS: ${fps}`
          frames = 0
          fpsAccum = 0
        }
      }

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)
        resizeGrid()
      }
    }

    const instance = new p5(sketch, container)

    return () => {
      instance.remove()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
    >
      <div ref={fpsRef} className="absolute top-2 left-2 z-10 text-white text-sm font-mono bg-black/40 px-2 py-1 rounded">
        FPS: --
      </div>
    </div>
  )
}