# mlops/pipeline.py
from datetime import datetime
import mlflow
import pandas as pd
from sklearn.model_selection import train_test_split
import tensorflow as tf

class MLPipeline:
    def __init__(self):
        mlflow.set_tracking_uri("http://mlflow:5000")
        self.experiment_name = "property_price_prediction"
        
    def run_pipeline(self):
        """End-to-end ML pipeline"""
        with mlflow.start_run():
            # 1. Data Collection
            raw_data = self.collect_data()
            mlflow.log_param("data_size", len(raw_data))
            
            # 2. Data Validation
            validated_data = self.validate_data(raw_data)
            
            # 3. Feature Engineering
            features = self.extract_features(validated_data)
            mlflow.log_param("feature_count", len(features.columns))
            
            # 4. Model Training
            X_train, X_test, y_train, y_test = train_test_split(
                features, validated_data['price'], test_size=0.2
            )
            
            model = self.train_model(X_train, y_train)
            mlflow.sklearn.log_model(model, "model")
            
            # 5. Model Evaluation
            metrics = self.evaluate_model(model, X_test, y_test)
            for name, value in metrics.items():
                mlflow.log_metric(name, value)
            
            # 6. Model Validation
            validation_result = self.validate_model(model, X_test, y_test)
            mlflow.log_metric("validation_score", validation_result['score'])
            
            # 7. Model Registry
            if validation_result['pass']:
                mlflow.register_model(
                    f"runs:/{mlflow.active_run().info.run_id}/model",
                    f"{self.experiment_name}_production"
                )
                
            # 8. Deployment
            if validation_result['pass'] and self.auto_deploy:
                self.deploy_model(model)
                
            # 9. Monitoring
            self.setup_monitoring(model)
            
    def setup_monitoring(self, model):
        """Set up model monitoring"""
        monitor = ModelMonitor(
            model=model,
            metrics=['accuracy', 'precision', 'recall', 'f1'],
            alert_thresholds={
                'accuracy': 0.85,
                'data_drift': 0.1,
                'concept_drift': 0.05
            }
        )
        
        # Continuous monitoring
        monitor.start()
        
    def collect_data(self):
        """Collect training data from multiple sources"""
        sources = [
            self.get_historical_sales(),
            self.get_market_trends(),
            self.get_economic_indicators(),
            self.get_property_features(),
            self.get_neighborhood_data()
        ]
        
        # Combine and deduplicate
        data = pd.concat(sources, ignore_index=True)
        data = data.drop_duplicates()
        
        return data
    
    def validate_data(self, data):
        """Validate data quality"""
        validator = DataValidator(data)
        
        # Check for missing values
        missing_report = validator.check_missing_values()
        if missing_report['total_missing'] > 0.1 * len(data):
            raise ValueError("Too many missing values")
            
        # Check for outliers
        outliers = validator.detect_outliers()
        data = validator.handle_outliers(outliers)
        
        # Check data types
        validator.validate_data_types()
        
        return data
    
    def train_model(self, X_train, y_train):
        """Train model with hyperparameter optimization"""
        # Define search space
        param_distributions = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 20, 30, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        }
        
        # Randomized search
        random_search = RandomizedSearchCV(
            RandomForestRegressor(),
            param_distributions,
            n_iter=20,
            cv=5,
            scoring='neg_mean_squared_error'
        )
        
        random_search.fit(X_train, y_train)
        
        return random_search.best_estimator_
    
    def deploy_model(self, model):
        """Deploy model to production"""
        # Save model artifacts
        model.save('models/latest_model.h5')
        
        # Update TensorFlow Serving
        self.update_tf_serving(model)
        
        # Update API endpoints
        self.update_api_endpoints(model)
        
        # Send deployment notification
        self.notify_deployment()