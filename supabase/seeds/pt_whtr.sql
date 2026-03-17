DELETE FROM public.pt_scoring_standards WHERE exercise_type = 'whtr';
INSERT INTO public.pt_scoring_standards (exercise_type, performance, points, health_risk_category)
VALUES 
  ('whtr', '<= 0.49', 20.0, 'Low Risk'),
  ('whtr', '0.5', 19.0, 'Moderate Risk'),
  ('whtr', '0.51', 18.0, 'Moderate Risk'),
  ('whtr', '0.52', 17.0, 'Moderate Risk'),
  ('whtr', '0.53', 16.0, 'Moderate Risk'),
  ('whtr', '0.54', 15.0, 'Moderate Risk'),
  ('whtr', '0.55', 12.5, 'High Risk'),
  ('whtr', '0.56', 10.0, 'High Risk'),
  ('whtr', '0.57', 7.5, 'High Risk'),
  ('whtr', '0.58', 5.0, 'High Risk'),
  ('whtr', '0.59', 2.5, 'High Risk'),
  ('whtr', '>= 0.6', 0.0, 'High Risk');