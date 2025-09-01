import React, { useState } from 'react';
import { useAppStore } from '../state/store';

export const RuleEditor = () => {
  const [ruleName, setRuleName] = useState('');
  const [ruleCondition, setRuleCondition] = useState('');
  const [ruleAction, setRuleAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement rule submission logic
    console.log({ ruleName, ruleCondition, ruleAction });
  };

  return (
    <div className="rule-editor">
      <h2>Create New Rule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rule Name:</label>
          <input 
            type="text" 
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Condition:</label>
          <textarea 
            value={ruleCondition}
            onChange={(e) => setRuleCondition(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Action:</label>
          <textarea 
            value={ruleAction}
            onChange={(e) => setRuleAction(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Rule</button>
      </form>
    </div>
  );
};