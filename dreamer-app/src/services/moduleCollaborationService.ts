/**
 * AI Module Collaboration Service
 * Enables communication and collaboration between sound design and visual modules
 */

export interface ModuleInsight {
  module: 'sound' | 'visual';
  insight: string;
  relevance: 'high' | 'medium' | 'low';
  actionable: boolean;
  sharedData?: any;
}

export interface CrossModuleSuggestion {
  type: 'sync' | 'contrast' | 'enhance' | 'balance';
  modules: string[];
  suggestion: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export class ModuleCollaborationService {
  private static instance: ModuleCollaborationService;
  private insights: Map<string, ModuleInsight[]> = new Map();
  private crossModuleSuggestions: CrossModuleSuggestion[] = [];

  static getInstance(): ModuleCollaborationService {
    if (!ModuleCollaborationService.instance) {
      ModuleCollaborationService.instance = new ModuleCollaborationService();
    }
    return ModuleCollaborationService.instance;
  }

  // Store insights from individual modules
  addModuleInsight(module: 'sound' | 'visual', insight: string, relevance: 'high' | 'medium' | 'low' = 'medium', sharedData?: any): void {
    const newInsight: ModuleInsight = {
      module,
      insight,
      relevance,
      actionable: true,
      sharedData
    };

    const moduleInsights = this.insights.get(module) || [];
    moduleInsights.push(newInsight);
    this.insights.set(module, moduleInsights);

    // Trigger cross-module analysis
    this.analyzeCrossModuleSynergies();
  }

  // Generate cross-module suggestions
  private analyzeCrossModuleSynergies(): void {
    const soundInsights = this.insights.get('sound') || [];
    const visualInsights = this.insights.get('visual') || [];

    this.crossModuleSuggestions = [];

    // Sound-Visual Synergies
    const soundVisualSync = this.findSoundVisualSync(soundInsights, visualInsights);
    if (soundVisualSync) {
      this.crossModuleSuggestions.push({
        type: 'sync',
        modules: ['sound', 'visual'],
        ...soundVisualSync
      });
    }

    const thematicEnhancement = this.findSoundVisualEnhancement(soundInsights, visualInsights);
    if (thematicEnhancement) {
      this.crossModuleSuggestions.push({
        type: 'enhance',
        modules: ['sound', 'visual'],
        ...thematicEnhancement
      });
    }
  }

  private findSoundVisualSync(soundInsights: ModuleInsight[], visualInsights: ModuleInsight[]) {
    // Look for mood/tone matches between sound and visual
    const soundMood = soundInsights.find(i => i.insight.includes('mood') || i.insight.includes('atmosphere'));
    const visualMood = visualInsights.find(i => i.insight.includes('lighting') || i.insight.includes('color'));

    if (soundMood && visualMood) {
      return {
        suggestion: 'Align sound atmosphere with visual mood for cohesive storytelling',
        rationale: 'Both sound and visual elements suggest similar atmospheric qualities',
        priority: 'high' as const
      };
    }

    // Look for energy level matches
    const soundEnergy = soundInsights.find(i => i.insight.includes('energy') || i.insight.includes('intensity'));
    const visualEnergy = visualInsights.find(i => i.insight.includes('movement') || i.insight.includes('camera'));

    if (soundEnergy && visualEnergy) {
      return {
        suggestion: 'Synchronize audio intensity with visual camera movement',
        rationale: 'Both elements indicate matching energy levels for dynamic sequences',
        priority: 'high' as const
      };
    }

    return null;
  }

  private findSoundVisualEnhancement(soundInsights: ModuleInsight[], visualInsights: ModuleInsight[]) {
    // Look for overall theme coherence between sound and visual insights
    const themes = [
      ...soundInsights.filter(i => i.insight.includes('theme') || i.insight.includes('emotion')),
      ...visualInsights.filter(i => i.insight.includes('theme') || i.insight.includes('emotion'))
    ];

    if (themes.length >= 2) {
      return {
        suggestion: 'Strengthen thematic coherence between audio and visual storytelling',
        rationale: 'Both sound and visual modules highlight similar thematic or emotional cues',
        priority: 'high' as const
      };
    }

    return null;
  }

  // Get all cross-module suggestions
  getCrossModuleSuggestions(): CrossModuleSuggestion[] {
    return this.crossModuleSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Get insights from specific module
  getModuleInsights(module: 'sound' | 'visual'): ModuleInsight[] {
    return this.insights.get(module) || [];
  }

  // Get combined insights from all modules
  getAllInsights(): ModuleInsight[] {
    return Array.from(this.insights.values()).flat();
  }

  // Clear insights (useful when starting new projects)
  clearInsights(): void {
    this.insights.clear();
    this.crossModuleSuggestions = [];
  }

  // Generate module-specific collaboration tips
  generateCollaborationTips(module: 'sound' | 'visual'): string[] {
    const tips: string[] = [];

    switch (module) {
      case 'sound':
        tips.push('Consider how your sound design will complement or contrast with visual lighting choices');
        tips.push('Match character emotional states through both sound design and visual pacing');
        tips.push('Use sound cues to enhance the visual focus and camera movement');
        break;

      case 'visual':
        tips.push('Coordinate visual mood with sound design for cohesive storytelling');
        tips.push('Plan camera movement with accompanying audio intensity in mind');
        tips.push('Use visual elements to support the narrative suggested by sound design motifs');
        break;
    }

    return tips;
  }

  // Analyze overall project coherence
  analyzeProjectCoherence(): {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } {
    const allInsights = this.getAllInsights();
    const suggestions = this.getCrossModuleSuggestions();
    
    let coherenceScore = 50; // Base score
    
    // Boost score based on high-relevance insights
    const highRelevanceInsights = allInsights.filter(i => i.relevance === 'high').length;
    coherenceScore += highRelevanceInsights * 10;
    
    // Adjust based on cross-module suggestions
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high').length;
    const lowPrioritySuggestions = suggestions.filter(s => s.priority === 'low').length;
    
    coherenceScore += highPrioritySuggestions * 5;
    coherenceScore -= lowPrioritySuggestions * 3;
    
    coherenceScore = Math.max(0, Math.min(100, coherenceScore));
    
    const strengths = [
      'Multiple AI modules providing insights',
      'Cross-module collaboration active',
      'Diverse perspectives enhancing storytelling'
    ];
    
    const weaknesses = [];
    if (suggestions.length === 0) {
      weaknesses.push('Limited cross-module interaction detected');
    }
    if (highPrioritySuggestions > 2) {
      weaknesses.push('Multiple high-priority improvements suggested');
    }
    
    const recommendations = suggestions.slice(0, 3).map(s => s.suggestion);
    
    return {
      score: coherenceScore,
      strengths,
      weaknesses,
      recommendations
    };
  }
}

// Export singleton instance
export const moduleCollaborationService = ModuleCollaborationService.getInstance();