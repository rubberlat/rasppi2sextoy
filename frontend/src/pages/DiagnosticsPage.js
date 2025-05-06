import React from 'react';

import { MotorProvider } from '../contexts/MotorContext';
import MotorDiagnostics from '../components/MotorDiagnostics';

function DiagnosticsPage() {
	return (
		<div>
			<h2>診断ページ</h2>
			<MotorProvider>
				<MotorDiagnostics />
			</MotorProvider>
		</div>
	);
}

export default DiagnosticsPage;
