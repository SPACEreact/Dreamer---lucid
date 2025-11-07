/**
 * AI Module Collaboration Service
 * Enables communication and collaboration between casting and visual modules
 */

export interface ModuleInsight {
  module: 'casting' | 'visual';
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
  addModuleInsight(module: 'casting' | 'visual', insight: string, relevance: 'high' | 'medium' | 'low' = 'medium', sharedData?: any): void {
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
    const castingInsights = this.insights.get('casting') || [];
    const visualInsights = this.insights.get('visual') || [];

    this.crossModuleSuggestions = [];

    // Visual-Casting Balance
    const visualCastingBalance = this.findVisualCastingBalance(visualInsights, castingInsights);
    if (visualCastingBalance) {
      this.crossModuleSuggestions.push({
        type: 'balance',
        modules: ['visual', 'casting'],
        ...visualCastingBalance
      });
    }

    // Cross-module thematic alignment
    const thematicAlignment = this.findCastingVisualAlignment(visualInsights, castingInsights);
    if (thematicAlignment) {
      this.crossModuleSuggestions.push({
        type: 'enhance',
        modules: ['visual', 'casting'],
        ...thematicAlignment
      });
    }
  }

  private findVisualCastingBalance(visualInsights: ModuleInsight[], castingInsights: ModuleInsight[]) {
    // Look for color schemes that complement character types
    const warmVisual = visualInsights.find(i => i.insight.includes('warm') || i.insight.includes('golden'));
    const seriousCharacter = castingInsights.find(i => i.insight.includes('serious') || i.insight.includes('professional'));

    if (warmVisual && seriousCharacter) {
      return {
        suggestion: 'Balance serious character presence with warm visual color grading',
        rationale: 'Warm colors can soften serious characters and create emotional depth',
        priority: 'medium' as const
      };
    }

    return null;
  }

  private findCastingVisualAlignment(visualInsights: ModuleInsight[], castingInsights: ModuleInsight[]) {
    // Look for overall theme coherence
    const themes = [
      ...castingInsights.filter(i => i.insight.includes('theme') || i.insight.includes('emotion')),
      ...visualInsights.filter(i => i.insight.includes('theme') || i.insight.includes('emotion'))
    ];

    if (themes.length >= 2) {
      return {
        suggestion: 'Strengthen thematic coherence between visual storytelling and casting choices',
        rationale: 'Both modules highlight compatible emotional or thematic directions worth emphasizing',
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
  getModuleInsights(module: 'casting' | 'visual'): ModuleInsight[] {
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
  generateCollaborationTips(module: 'casting' | 'visual'): string[] {
    const tips: string[] = [];

    switch (module) {
      case 'casting':
        tips.push('Consider visual style when selecting actors that fit the aesthetic mood');
        tips.push('Share casting insights with visual designers to ensure character presentation feels cohesive');
        tips.push('Highlight emotional beats so visual teams can reinforce them through lighting and composition');
        break;

      case 'visual':
        tips.push('Consider casting choices when developing visual character presentation');
        tips.push('Use color and lighting cues that reinforce the emotional tone suggested by casting');
        tips.push('Share visual motifs that could influence wardrobe and performance decisions');
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