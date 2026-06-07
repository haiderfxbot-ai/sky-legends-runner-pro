const Helpers = {
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    formatDistance(meters) {
        return `${Math.floor(meters)}m`;
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    darkenColor(color, amount) {
        const r = Math.max(0, (color >> 16) - amount);
        const g = Math.max(0, ((color >> 8) & 0x00FF) - amount);
        const b = Math.max(0, (color & 0x0000FF) - amount);
        return (r << 16) | (g << 8) | b;
    },

    lightenColor(color, amount) {
        const r = Math.min(255, (color >> 16) + amount);
        const g = Math.min(255, ((color >> 8) & 0x00FF) + amount);
        const b = Math.min(255, (color & 0x0000FF) + amount);
        return (r << 16) | (g << 8) | b;
    },

    createGradientTexture(scene, key, width, height, colors) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        
        colors.forEach((color, index) => {
            const stop = index / (colors.length - 1);
            gradient.addColorStop(stop, `#${color.toString(16).padStart(6, '0')}`);
        });
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    createCircleTexture(scene, key, radius, color) {
        const size = radius * 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fill();
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    createRectangleTexture(scene, key, width, height, color, radius = 0) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (radius > 0) {
            ctx.beginPath();
            ctx.roundRect(0, 0, width, height, radius);
            ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
            ctx.fill();
        } else {
            ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
            ctx.fillRect(0, 0, width, height);
        }
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    createTriangleTexture(scene, key, width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fill();
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    createStarTexture(scene, key, radius, points, color) {
        const size = radius * 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? radius : radius * 0.5;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = radius + r * Math.cos(angle);
            const y = radius + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fill();
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    createDiamondTexture(scene, key, width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(width / 2, height);
        ctx.lineTo(0, height / 2);
        ctx.closePath();
        ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        ctx.fill();
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    createParticleTexture(scene, key, size, color) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        gradient.addColorStop(0, `#${color.toString(16).padStart(6, '0')}`);
        gradient.addColorStop(1, `#${color.toString(16).padStart(6, '0')}00`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        if (scene.textures.exists(key)) {
            scene.textures.remove(key);
        }
        scene.textures.addCanvas(key, canvas);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    easeOutQuad(t) {
        return t * (2 - t);
    },

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    easeOutCubic(t) {
        return (--t) * t * t + 1;
    },

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },

    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    },

    isToday(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }
};
