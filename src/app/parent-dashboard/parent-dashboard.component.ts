import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
	selector: 'app-parent-dashboard',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './parent-dashboard.component.html',
	styleUrls: ['./parent-dashboard.component.scss']
})
export class ParentDashboardComponent implements OnInit {
	parentUsername: string | null = null;
	isSidebarExpanded: boolean = false;
	
	// Tooltip properties
	tooltipVisible: boolean = false;
	tooltipText: string = '';
	tooltipX: number = 0;
	tooltipY: number = 0;

	constructor(private router: Router) {}

	ngOnInit() {
		this.parentUsername = localStorage.getItem('parentUsername');
	}

	toggleSidebar() {
		this.isSidebarExpanded = !this.isSidebarExpanded;
	}

	closeSidebar() {
		this.isSidebarExpanded = false;
	}

	logout() {
		localStorage.removeItem('parentToken');
		localStorage.removeItem('parentUsername');
		localStorage.removeItem('child');
		this.router.navigate(['/']);
	}

	// Tooltip methods
	showTooltip(text: string, event: MouseEvent) {
		// Only show tooltip when sidebar is collapsed
		if (!this.isSidebarExpanded) {
			this.tooltipText = text;
			// Position tooltip right beside the icon with minimal gap
			const rect = (event.target as HTMLElement).getBoundingClientRect();
			this.tooltipX = 60 + 8; // sidebar width + small gap
			this.tooltipY = rect.top + (rect.height / 2);
			this.tooltipVisible = true;
		}
	}

	hideTooltip() {
		this.tooltipVisible = false;
	}
}
