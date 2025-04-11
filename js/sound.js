/* Sound effects system for the portfolio website */

// Sound class for managing audio effects
class SoundSystem {
    constructor() {
        // Initialize sound library
        this.sounds = {};
        
        // Default volume
        this.volume = 0.2;
        
        // Muted state
        this.muted = false;
        
        // Initialize sound toggle UI
        this.createSoundToggle();
        
        // Load default sounds
        this.loadDefaultSounds();
    }
    
    // Create sound toggle button
    createSoundToggle() {
        const soundToggle = document.createElement('div');
        soundToggle.classList.add('sound-toggle');
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        document.body.appendChild(soundToggle);
        
        // Add click event
        soundToggle.addEventListener('click', () => {
            this.toggleMute();
            
            // Update icon
            if (this.muted) {
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });
    }
    
    // Load default sounds
    loadDefaultSounds() {
        this.loadSound('hover', '/audio/hover.mp3');
        this.loadSound('click', '/audio/click.mp3');
        this.loadSound('success', '/audio/success.mp3');
    }
    
    // Load a sound
    loadSound(name, url) {
        const audio = new Audio(url);
        audio.volume = this.volume;
        this.sounds[name] = audio;
        
        // Make sound available globally
        if (!window.sounds) {
            window.sounds = {};
        }
        window.sounds[name] = audio;
        
        return audio;
    }
    
    // Play a sound
    playSound(name) {
        if (this.muted) return;
        
        if (this.sounds[name]) {
            // Clone the audio to allow overlapping sounds
            const soundClone = this.sounds[name].cloneNode();
            soundClone.volume = this.volume;
            soundClone.play().catch(e => console.log("Audio play failed:", e));
        }
    }
    
    // Set volume for all sounds
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    // Toggle mute state
    toggleMute() {
        this.muted = !this.muted;
    }
    
    // Add sound to interactive elements
    addSoundToElements() {
        // Add hover sound to all interactive elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .model-option, .nav-item, .btn, .terrain-control-group .btn');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });
        });
        
        // Add click sound to all clickable elements
        const clickElements = document.querySelectorAll('a, button, .project-card, .model-option, .nav-item, .btn, .terrain-control-group .btn, input[type="checkbox"], input[type="radio"], select');
        
        clickElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playSound('click');
            });
        });
    }
}

// Initialize sound system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create sound system
    const soundSystem = new SoundSystem();
    
    // Add sounds to interactive elements
    soundSystem.addSoundToElements();
    
    // Make sound system available globally
    window.soundSystem = soundSystem;
});
