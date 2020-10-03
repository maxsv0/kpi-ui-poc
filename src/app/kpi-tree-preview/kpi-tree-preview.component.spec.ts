import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTreePreviewComponent } from './kpi-tree-preview.component';

describe('KpiTreePreviewComponent', () => {
  let component: KpiTreePreviewComponent;
  let fixture: ComponentFixture<KpiTreePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiTreePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTreePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
