import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTreesComponent } from './kpi-trees.component';

describe('KpiTreesComponent', () => {
  let component: KpiTreesComponent;
  let fixture: ComponentFixture<KpiTreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiTreesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
