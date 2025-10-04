import React, { useState, useEffect, useRef } from 'react';

const AnimatedBalls = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const ballsRef = useRef([]);

  // Colors for the balls
  const colors = [
    '#0808ff', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#046e32ff', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  // Ball class
  class Ball {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 8 + 3; // 3-11px radius
      this.vx = (Math.random() - 0.5) * 2; // -1 to 1
      this.vy = (Math.random() - 0.5) * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.trail = [];
      this.maxTrailLength = 8;
      this.glowIntensity = Math.random() * 0.5 + 0.5;
    }

    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
        this.vx = -this.vx;
      }
      if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
        this.vy = -this.vy;
      }

      // Keep balls within bounds
      this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
      this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));

      // Add current position to trail
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }

      // Update glow intensity
      this.glowIntensity = Math.sin(Date.now() * 0.003 + this.x * 0.01) * 0.3 + 0.7;
    }

    draw(ctx) {
      // Draw trail
      for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i];
        const alpha = (i / this.trail.length) * 0.6;
        const trailRadius = this.radius * (i / this.trail.length) * 0.8;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }

      // Draw main ball with glow effect
      ctx.save();
      
      // Outer glow
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius * 3
      );
      gradient.addColorStop(0, `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, 0.5)`);
      gradient.addColorStop(0.3, `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, 0.25)`);
      gradient.addColorStop(1, `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, 0)`);

      ctx.globalAlpha = this.glowIntensity * 0.8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner glow
      const innerGradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      innerGradient.addColorStop(0, '#FFFFFF');
      innerGradient.addColorStop(0.7, this.color);
      innerGradient.addColorStop(1, this.color + 'DD');

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = innerGradient;
      ctx.fill();

      // Add sparkle effect
      if (Math.random() < 0.1) {
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(
          this.x + (Math.random() - 0.5) * this.radius,
          this.y + (Math.random() - 0.5) * this.radius,
          1,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize balls
    const numBalls = 15;
    ballsRef.current = [];
    for (let i = 0; i < numBalls; i++) {
      ballsRef.current.push(new Ball(canvas));
    }

    // Animation loop
    const animate = () => {
      // Create trailing effect by not clearing completely
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw balls
      ballsRef.current.forEach(ball => {
        ball.update();
        ball.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        // className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
        style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}
      />
    </div>
  );
};

export default AnimatedBalls;
