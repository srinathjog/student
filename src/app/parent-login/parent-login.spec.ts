import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentLoginComponent } from './parent-login';

describe('ParentLoginComponent', () => {
	let component: ParentLoginComponent;
	let fixture: ComponentFixture<ParentLoginComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ParentLoginComponent]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ParentLoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
