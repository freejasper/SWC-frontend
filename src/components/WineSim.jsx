import { useEffect, useRef } from 'react'
import p5 from 'p5'

export default function WineSim() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sketch = (p) => {
      let friction = 0.98


      class Droplet {
        constructor(x, y) {
          this._x = x
          this._y = y
          this._vector = [0, 0]
        }
        get x() { return this._x }
        set x(newX) { this._x = newX }
        get y() { return this._y }
        set y(newY) { this._y = newY }
        get vector() { return this._vector }
        set vector(vector) { this._vector = vector }
        updatePosition(fx = 0, fy = 0) {
          this.vector[0] = p.constrain(this.vector[0] + fx, -5, 5)
          this.vector[1] = p.constrain(this.vector[1] + fy, -5, 5)
          this.vector[0] *= friction
          this.vector[1] *= friction
          this.x += this.vector[0]
          this.y += this.vector[1]
          if (this.x <= 0 || this.x >= p.width) {
            this.vector[0] *= -0.5
            this.x = p.constrain(this.x, 1, p.width - 1)
          }
          if (this.y <= 0 || this.y >= p.height) {
            this.vector[1] *= -0.5
            this.y = p.constrain(this.y, 1, p.height - 1)
          }
        }
      }

      let dropSize = 30
      let droplets = []
      let cellSize = dropSize - 5
      let dropDist = cellSize + 7
      let mDropDist = dropDist + 40
      let startTime = null
      const totalDroplets = 1000
      const spawnDuration = 5000

      let gravity = 0.5

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight)
        p.pixelDensity(1)
        p.canvas.style.filter = 'blur(12px) contrast(60)'
        p.canvas.style.pointerEvents = 'none'
        p.canvas.stylemixBlendMode = 'screen'
        startTime = p.millis()
      }

      p.draw = () => {
        p.background(255, 255, 255)

        const now = p.millis()
        let target
        if (startTime !== null && now - startTime < spawnDuration) {
          target = p.floor(p.map(now - startTime, 0, spawnDuration, 0, totalDroplets))
        } else {
          target = totalDroplets
        }
        while (droplets.length < target) {
          droplets.push(new Droplet(p.width / 2, 0))
        }

        let forces = droplets.map(() => ({ x: 0, y: gravity }))

        let grid = {}
        droplets.forEach((droplet) => {
          const row = Math.floor(droplet.x / cellSize)
          const col = Math.floor(droplet.y / cellSize)
          const key = `${row},${col}`

          if (!grid[key]) grid[key] = []
          grid[key].push(droplet)
        })

        for (let i = 0; i < droplets.length; i++) {
          let drop = droplets[i]
          let row = Math.floor(drop.x / cellSize)
          let col = Math.floor(drop.y / cellSize)

          let mDist = p.dist(drop.x, drop.y, p.mouseX, p.mouseY)
          if (mDist < mDropDist) {
            let mStr = (mDropDist - mDist) / mDropDist
            let mDx = drop.x - p.mouseX
            let mDy = drop.y - p.mouseY
            let mPushX = (mDx / mDist) * mStr * 1.25
            let mPushY = (mDy / mDist) * mStr * 1.25
            forces[i].x += mPushX
            forces[i].y += mPushY
          }

          for (let xOffset = -1; xOffset <= 1; xOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
              let nKey = `${row + xOffset},${col + yOffset}`
              let neighbour = grid[nKey]

              if (neighbour) {
                for (let nDrop of neighbour) {
                  if (drop === nDrop) continue

                  let dx = drop.x - nDrop.x
                  let dy = drop.y - nDrop.y

                  let distance = p.sqrt(dx * dx + dy * dy) || 0.01

                  if (distance === 0.01) {
                    forces[i].x += p.random(-0.2, 0.2)
                    forces[i].y += p.random(-0.2, 0.2)
                  }

                  if (distance < dropDist) {
                    let str = (dropDist - distance) / dropDist
                    let pushX = (dx / distance) * str * 0.5
                    let pushY = (dy / distance) * str * 0.5
                    forces[i].x += pushX
                    forces[i].y += pushY
                  }
                }
              }
            }
          }
        }

        droplets.forEach((droplet, i) => {
          let fx = forces[i].x
          let fy = forces[i].y

          droplet.updatePosition(fx, fy)
          p.fill(0)
          p.noStroke()
          p.ellipse(droplet.x, droplet.y, dropSize, dropSize)
        })
      }

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)
      }
    }

    const instance = new p5(sketch, container)

    return () => {
      instance.remove()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-10 w-full h-full bg-[#db3605] pointer-events-none overflow-hidden isolate">
  
      <div className="absolute inset-0 w-full h-full mix-blend-darken">
        
        <div className="absolute inset-0 w-full h-full bg-[#bf0503]" />
        
        <div 
          ref={containerRef} 
          className="absolute inset-0 w-full h-full mix-blend-screen" 
        />
      </div>
    </div>
  )
}
