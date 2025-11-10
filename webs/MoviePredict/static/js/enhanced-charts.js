// ========================================
// ENHANCED CHARTS FOR PREDICTION RESULTS
// Confidence Gauge + Feature Importance
// ========================================

/**
 * Render Confidence Gauge Chart (Doughnut/Semi-circle)
 * Shows prediction confidence as a visual gauge
 */
function renderConfidenceGauge(confidence) {
    const canvas = document.getElementById('confidenceGaugeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if any
    if (window.confidenceGaugeChartInstance) {
        window.confidenceGaugeChartInstance.destroy();
    }
    
    // Determine color and label based on confidence level
    let gaugeColor, label, description;
    if (confidence >= 80) {
        gaugeColor = '#10b981'; // Green
        label = 'Độ Tin Cậy Cao';
        description = 'Model rất chắc chắn về dự đoán này. Kết quả có độ tin cậy cao.';
    } else if (confidence >= 60) {
        gaugeColor = '#f59e0b'; // Orange
        label = 'Độ Tin Cậy Trung Bình';
        description = 'Model khá chắc chắn nhưng vẫn có một số yếu tố không chắc chắn.';
    } else {
        gaugeColor = '#ef4444'; // Red
        label = 'Độ Tin Cậy Thấp';
        description = 'Model không hoàn toàn chắc chắn. Nên cân nhắc thêm dữ liệu.';
    }
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, gaugeColor);
    gradient.addColorStop(1, gaugeColor + 'cc');
    
    // Chart data
    const data = {
        datasets: [{
            data: [confidence, 100 - confidence],
            backgroundColor: [gradient, '#e5e7eb'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270
        }]
    };
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '75%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    };
    
    // Create chart
    window.confidenceGaugeChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
        plugins: [{
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2 + 30;
                
                // Draw confidence percentage
                ctx.save();
                ctx.font = 'bold 48px Inter';
                ctx.fillStyle = gaugeColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(confidence.toFixed(1) + '%', centerX, centerY);
                
                // Draw label
                ctx.font = '16px Inter';
                ctx.fillStyle = '#6b7280';
                ctx.fillText(label, centerX, centerY + 40);
                
                ctx.restore();
            }
        }]
    });
    
    // Update explanation text
    const explanationDiv = document.getElementById('confidenceExplanation');
    if (explanationDiv) {
        explanationDiv.innerHTML = `
            <p style="color: var(--text-secondary); margin-top: 16px;">
                ${description}
            </p>
        `;
    }
}

/**
 * Render Feature Importance Chart (Horizontal Bar)
 * Shows TOP 10 features from actual model.feature_importances_
 */
function renderFeatureImportance(featureImportanceData, voteAverage = 7.0) {
    const canvas = document.getElementById('featureImportanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if any
    if (window.featureImportanceChartInstance) {
        window.featureImportanceChartInstance.destroy();
    }
    
    // Extract top features from API response
    let features = [];
    
    if (featureImportanceData && featureImportanceData.top_features) {
        // Use data from API (actual model.feature_importances_)
        features = featureImportanceData.top_features.map((f, i) => {
            // Generate color gradient
            const hue = 260 - (i * 15); // Purple to blue gradient
            
            // ✅ FIX: Safely handle undefined values
            const value = (f.value !== undefined && f.value !== null) ? f.value : 0;
            const displayValue = (typeof value === 'number') ? value.toFixed(2) : '0.00';
            
            return {
                name: `${f.name} (${displayValue})`,
                importance: f.importance || 0,
                color: `hsl(${hue}, 70%, 60%)`
            };
        });
        
        console.log('📊 Using real feature importance from model:', features);
    } else {
        // Fallback: Use hardcoded values from Week 6 analysis
        features = [
            { 
                name: `Vote Average (${voteAverage}/10)`, 
                importance: 76.5,
                color: '#667eea'
            },
            { 
                name: 'ROI Features', 
                importance: 23.5,
                color: '#764ba2'
            },
            { 
                name: 'Other 43 Features', 
                importance: 0.0,
                color: '#e5e7eb'
            }
        ];
        
        console.warn('⚠️ Using fallback feature importance (hardcoded)');
    }
    
    // Chart data
    const data = {
        labels: features.map(f => f.name),
        datasets: [{
            label: 'Mức Độ Ảnh Hưởng (%)',
            data: features.map(f => f.importance),
            backgroundColor: features.map(f => f.color),
            borderRadius: 8,
            borderSkipped: false
        }]
    };
    
    // Chart options
    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function(context) {
                        return `Ảnh hưởng: ${context.parsed.x.toFixed(2)}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    },
                    color: '#6b7280',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                title: {
                    display: true,
                    text: 'Mức Độ Quan Trọng (%)',
                    color: '#374151',
                    font: {
                        size: 13,
                        weight: '600'
                    }
                }
            },
            y: {
                ticks: {
                    color: '#374151',
                    font: {
                        size: 11
                    },
                    autoSkip: false
                },
                grid: {
                    display: false
                }
            }
        }
    };
    
    // Create chart
    window.featureImportanceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options,
        plugins: [{
            afterDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data > 0) {
                            ctx.save();
                            ctx.font = 'bold 13px Inter';
                            ctx.fillStyle = '#374151';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            const text = data.toFixed(2) + '%';
                            ctx.fillText(text, bar.x + 8, bar.y);
                            ctx.restore();
                        }
                    });
                });
            }
        }]
    });
}

/**
 * Initialize enhanced charts after prediction results
 * Call this function after displaying prediction results
 */
function initializeEnhancedCharts(predictionResult) {
    console.log('🎨 Rendering enhanced charts...');
    console.log('📦 Prediction result:', predictionResult);
    
    // Extract data from prediction result
    const confidence = predictionResult.confidence || 75;
    const voteAverage = predictionResult.data?.voteAverage || 
                        predictionResult.data?.vote_average || 
                        predictionResult.input_data?.vote_average || 7.0;
    
    // ✨ NEW: Extract feature_importance from API response
    const featureImportanceData = predictionResult.feature_importance || null;
    
    if (featureImportanceData) {
        console.log('✅ Feature importance data received from API:', featureImportanceData);
    } else {
        console.warn('⚠️ No feature_importance in API response, using fallback');
    }
    
    // Render charts
    setTimeout(() => {
        renderConfidenceGauge(confidence);
        renderFeatureImportance(featureImportanceData, voteAverage);
        console.log('✅ Enhanced charts rendered successfully');
    }, 300);
}

// Export functions for use in main app.js
if (typeof window !== 'undefined') {
    window.renderConfidenceGauge = renderConfidenceGauge;
    window.renderFeatureImportance = renderFeatureImportance;
    window.initializeEnhancedCharts = initializeEnhancedCharts;
}
