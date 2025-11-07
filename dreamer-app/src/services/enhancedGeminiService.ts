// Enhanced Gemini Service with Extended Capabilities
// Adds TTS, advanced prompting, and enhanced AI features

import {
    analyzeSoundMood as geminiAnalyzeSoundMood,
    generateSoundSuggestions as geminiGenerateSoundSuggestions,
    generateFoleySuggestions as geminiGenerateFoleySuggestions,
} from './geminiService';
import { AudioMoodTag, AudioSuggestion, FoleySuggestion } from '../types';

// Text-to-Speech using Web Speech API as fallback
class TextToSpeechService {
    private synth: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    
    constructor() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synth = window.speechSynthesis;
            this.loadVoices();
        }
    }
    
    private loadVoices() {
        if (!this.synth) return;
        
        this.voices = this.synth.getVoices();
        
        if (this.voices.length === 0) {
            this.synth.addEventListener('voiceschanged', () => {
                this.voices = this.synth!.getVoices();
            });
        }
    }
    
    speak(text: string, options: { voice?: string, rate?: number, pitch?: number } = {}) {
        if (!this.synth) {
            console.warn('Text-to-Speech not supported in this environment');
            return;
        }
        
        // Cancel any ongoing speech
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find appropriate voice
        if (options.voice) {
            const voice = this.voices.find(v => v.name.includes(options.voice!));
            if (voice) utterance.voice = voice;
        } else {
            // Use a natural-sounding voice if available
            const preferredVoice = this.voices.find(v => 
                v.name.includes('Natural') || 
                v.name.includes('Premium') ||
                v.lang.startsWith('en-')
            );
            if (preferredVoice) utterance.voice = preferredVoice;
        }
        
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        
        this.synth.speak(utterance);
    }
    
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
    
    getAvailableVoices() {
        return this.voices;
    }
}

// Singleton instance
const ttsService = new TextToSpeechService();

// Enhanced Sound Design Functions with TTS Preview
/**
 * Sanitizes error messages to prevent sensitive information exposure
 */
function sanitizeErrorMessage(error: unknown): string {
  const errorStr = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack || '' : '';
  
  const fullErrorText = `${errorStr}\n${errorStack}`;
  
  const sanitized = fullErrorText
    .replace(/AIza[0-9A-Za-z\-_]{35}/g, '[API_KEY]')
    .replace(/api[_-]?key["']?\s*[:=]\s*["']?([0-9A-Za-z\-_]{32,})/gi, 'api_key: [REDACTED]')
    .replace(/authorization["']?\s*[:=]\s*["']?Bearer\s+[0-9A-Za-z\-_.]+/gi, 'Authorization: Bearer [REDACTED]')
    .replace(/\b[0-9A-Za-z\-_]{40,}\b/g, '[REDACTED_TOKEN]')
    .replace(/process\.env\.[A-Z_]+/g, '[ENV_VAR]')
    .split('\n')[0];
    
  return sanitized;
}

export const analyzeSoundMoodEnhanced = async (
    sceneDescription: string, 
    visualMood: string
): Promise<{ moods: AudioMoodTag[], reasoning: string }> => {
    try {
        const moods = await geminiAnalyzeSoundMood(sceneDescription, visualMood);
        
        // Generate reasoning for the mood selection
        const reasoning = `Based on the scene description "${sceneDescription.substring(0, 50)}..." and visual mood "${visualMood}", the AI has identified ${moods.length} primary audio moods: ${moods.join(', ')}. This selection creates an immersive soundscape that enhances the emotional impact of the scene.`;
        
        return { moods, reasoning };
    } catch (error) {
        console.error('Enhanced sound mood analysis failed:', sanitizeErrorMessage(error));
        return { 
            moods: ['ambient'], 
            reasoning: 'Using default ambient mood due to analysis error.' 
        };
    }
};

export const generateSoundSuggestionsEnhanced = async (
    sceneDescription: string,
    mood: AudioMoodTag[],
    cameraMovement: string,
    lighting: string
): Promise<{ suggestions: AudioSuggestion[], description: string }> => {
    try {
        const suggestions = await geminiGenerateSoundSuggestions(
            sceneDescription, 
            mood, 
            cameraMovement, 
            lighting
        );
        
        const description = `Generated ${suggestions.length} professional sound suggestions optimized for ${mood.join('/')} mood with ${cameraMovement} camera movement and ${lighting} lighting. Each suggestion is carefully crafted to enhance the cinematic experience.`;
        
        return { suggestions, description };
    } catch (error) {
        console.error('Enhanced sound suggestions failed:', sanitizeErrorMessage(error));
        return { 
            suggestions: [], 
            description: 'Sound generation encountered an error.' 
        };
    }
};

export const generateFoleySuggestionsEnhanced = async (
    characters: string[],
    sceneDescription: string,
    cameraMovement: string
): Promise<{ suggestions: FoleySuggestion[], insights: string }> => {
    try {
        const suggestions = await geminiGenerateFoleySuggestions(
            characters,
            sceneDescription,
            cameraMovement
        );
        
        const insights = `Generated ${suggestions.length} foley suggestions for ${characters.length} character(s). These sound effects add realistic layers to character movements and interactions, creating a more immersive audio experience.`;
        
        return { suggestions, insights };
    } catch (error) {
        console.error('Enhanced foley suggestions failed:', sanitizeErrorMessage(error));
        return { 
            suggestions: [], 
            insights: 'Foley generation encountered an error.' 
        };
    }
};

// Preview audio suggestion using TTS
export const previewAudioSuggestion = (description: string) => {
    const previewText = `Audio suggestion: ${description}`;
    ttsService.speak(previewText, { rate: 1.1 });
};

// Stop audio preview
export const stopAudioPreview = () => {
    ttsService.stop();
};

// Advanced prompt enhancement for better AI results
export const enhancePromptForAI = (basePrompt: string, context: string): string => {
    return `${basePrompt}

ADDITIONAL CONTEXT:
${context}

Please provide detailed, professional, and creative suggestions that align with industry best practices and cinematic excellence.`;
};

// Get TTS service for external use
export const getTTSService = () => ttsService;

// Export usage monitoring
export const getEnhancedServiceStats = () => {
    return {
        ttsAvailable: ttsService !== null,
        availableVoices: ttsService?.getAvailableVoices().length || 0,
        timestamp: new Date().toISOString()
    };
};
