# scaling/AutoScaler.py
import numpy as np
from datetime import datetime, timedelta
import asyncio

class IntelligentAutoScaler:
    def __init__(self):
        self.metrics_history = []
        self.scaling_decisions = []
        self.prediction_model = self.load_prediction_model()
        
    async def monitor_and_scale(self):
        """Main monitoring loop"""
        while True:
            # Collect current metrics
            current_metrics = await self.collect_metrics()
            self.metrics_history.append(current_metrics)
            
            # Keep only last 24 hours
            self.metrics_history = self.metrics_history[-1440:]  # 1 min intervals
            
            # Predict future load
            predicted_load = self.predict_future_load()
            
            # Make scaling decision
            scaling_decision = self.make_scaling_decision(
                current_metrics, predicted_load
            )
            
            # Execute scaling
            if scaling_decision['action'] != 'none':
                await self.execute_scaling(scaling_decision)
                
            # Log decision
            self.log_decision(scaling_decision)
            
            # Wait before next check
            await asyncio.sleep(60)  # Check every minute
            
    def predict_future_load(self, horizon_minutes=30):
        """Predict future load using time series analysis"""
        # Extract load patterns
        historical_load = [m['cpu_utilization'] for m in self.metrics_history]
        
        if len(historical_load) < 60:  # Need at least 1 hour of data
            return self.baseline_prediction()
        
        # Use multiple prediction methods
        predictions = {
            'arima': self.arima_predict(historical_load, horizon_minutes),
            'lstm': self.lstm_predict(historical_load, horizon_minutes),
            'prophet': self.prophet_predict(historical_load, horizon_minutes),
            'seasonal': self.seasonal_predict(historical_load, horizon_minutes)
        }
        
        # Ensemble predictions
        ensemble_prediction = np.mean(list(predictions.values()))
        
        # Add confidence intervals
        confidence = self.calculate_confidence(predictions)
        
        return {
            'predicted_load': ensemble_prediction,
            'confidence': confidence,
            'by_method': predictions,
            'peak_expected': np.max(list(predictions.values()))
        }
        
    def make_scaling_decision(self, current_metrics, predicted_load):
        """Make intelligent scaling decision"""
        decision = {
            'timestamp': datetime.now(),
            'current_load': current_metrics['cpu_utilization'],
            'predicted_load': predicted_load['predicted_load'],
            'action': 'none',
            'instances': current_metrics['instance_count'],
            'reason': ''
        }
        
        # Scale up conditions
        if (predicted_load['predicted_load'] > 80 and 
            predicted_load['confidence'] > 0.7):
            decision['action'] = 'scale_up'
            decision['instances'] = min(
                current_metrics['instance_count'] * 2,
                self.max_instances
            )
            decision['reason'] = 'High predicted load with high confidence'
            
        # Scale down conditions
        elif (predicted_load['predicted_load'] < 20 and 
              current_metrics['cpu_utilization'] < 30 and
              current_metrics['instance_count'] > self.min_instances):
            decision['action'] = 'scale_down'
            decision['instances'] = max(
                current_metrics['instance_count'] // 2,
                self.min_instances
            )
            decision['reason'] = 'Low current and predicted load'
            
        # Predictive scaling for known patterns
        elif self.is_peak_hour() and current_metrics['instance_count'] < 5:
            decision['action'] = 'scale_up'
            decision['instances'] = 5
            decision['reason'] = 'Scheduled peak hour scaling'
            
        return decision
        
    async def execute_scaling(self, decision):
        """Execute the scaling decision"""
        if decision['action'] == 'scale_up':
            await self.scale_up(decision['instances'])
        elif decision['action'] == 'scale_down':
            await self.scale_down(decision['instances'])
            
        # Update load balancer
        await self.update_load_balancer()
        
        # Notify monitoring system
        await self.notify_scaling_event(decision)
        
    def learn_from_decisions(self):
        """Learn from past scaling decisions for improvement"""
        successful_decisions = [
            d for d in self.scaling_decisions 
            if d['outcome'] == 'success'
        ]
        
        failed_decisions = [
            d for d in self.scaling_decisions 
            if d['outcome'] == 'failure'
        ]
        
        # Adjust thresholds based on learning
        if len(failed_decisions) > 0:
            self.adjust_scaling_thresholds(failed_decisions)
            
        # Update prediction model
        if len(successful_decisions) > 100:
            self.retrain_prediction_model(successful_decisions)