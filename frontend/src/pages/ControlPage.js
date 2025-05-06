import React from 'react';

import { MotorProvider } from '../contexts/MotorContext';
import ModernMotorControlTimeline from '../components/MotorTimeline';

function DiagnosticsPage() {
	return (
		<div>
			<h2>モーター制御タイムライン</h2>
			<MotorProvider>
				<ModernMotorControlTimeline />
			</MotorProvider>
		</div>
	);
}

export default DiagnosticsPage;

