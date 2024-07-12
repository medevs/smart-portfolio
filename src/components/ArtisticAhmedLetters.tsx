"use client"

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FullWidthAhmedAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 90
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ahmed: string[] = ['ⵃ', 'ⵎ', 'ⴰ', 'ⴷ']; // Ahmed in Tifinagh
    let time = 0;

    class Letter {
      char: string;
      x: number;
      y: number;
      baseY: number;

      constructor(char: string, x: number, y: number) {
        this.char = char;
        this.x = x;
        this.y = y;
        this.baseY = y;
      }

      draw(context: CanvasRenderingContext2D) {
        const yOffset = Math.sin(time * 0.1 + this.x * 0.1) * 10;
        const scale = 1 + Math.sin(time * 0.2 + this.x * 0.1) * 0.2;
        context.save();
        context.translate(this.x, this.y + yOffset);
        context.scale(scale, scale);
        context.fillStyle = `hsl(${(time * 2 + this.x) % 360}, 70%, 60%)`;
        context.font = 'bold 40px serif';
        context.fillText(this.char, 0, 0);
        context.restore();
      }
    }

    const letters = ahmed.map((char, i) =>
      new Letter(char, (dimensions.width / 5) + i * (dimensions.width / 7), canvas.height / 2)
    );

    interface Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
    }

    const particles: Particle[] = [];

    const codeSnippets: string[] = [
      '{ }', '[ ]', '( )', ';', '//', '/* */',
      'if', 'for', 'class', 'const', 'let', 'var',
      '=>', '&&', '||', '===', '!==', '++'
    ];

    class CodeElement {
      text: string;
      x: number;
      y: number;
      speed: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.speed = Math.random() * 0.5 + 0.1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = 'rgba(0, 255, 0, 0.7)';
        context.font = '12px monospace';
        context.fillText(this.text, this.x, this.y);
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.y += this.speed;
        if (this.y > canvasHeight) {
          this.y = 0;
          this.x = Math.random() * canvasWidth;
        }
      }
    }

    const codeElements: CodeElement[] = Array(Math.floor(dimensions.width / 30))
      .fill(null)
      .map(() => new CodeElement(dimensions.width, dimensions.height));

    const drawFrame = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw letters
      letters.forEach(letter => letter.draw(ctx));

      // Create particles
      if (Math.random() < 0.2) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 2 + 1
        });
      }

      // Draw and update particles
      particles.forEach((particle, index) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        particle.y -= particle.speed;
        if (particle.y < 0) particles.splice(index, 1);
      });

      // Draw and update code elements
      codeElements.forEach(element => {
        element.draw(ctx);
        element.update(dimensions.width, dimensions.height);
      });

      time += 0.05;
    };

    let animationFrameId: number;
    const animate = () => {
      drawFrame();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dimensions]);

  return (
    <motion.div
      ref={containerRef}
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
};

export default FullWidthAhmedAnimation;