import { useEffect, useRef } from "react";

export const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
     const ctx = canvas.getContext("2d");
    let raf;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const density = Math.floor((canvas.width * canvas.height) / 9000);
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.8 + 0.1,
        da: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        hue: Math.random() > 0.85 ? "cyan" : "white",
      }));
       };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.a += s.da;
        if (s.a <= 0.1 || s.a >= 0.95) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle =
          s.hue === "cyan"
            ? `rgba(56, 232, 225, ${s.a})`
            : `rgba(255, 255, 255, ${s.a})`;
        ctx.fill();
        });
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      style={{
        background:
          "radial-gradient(ellipse at 70% 30%, rgba(45, 20, 90, 0.35) 0%, rgba(6, 10, 20, 1) 60%)",
      }}
    />
  );
};