import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KpiTreeComponent} from './kpi-tree.component';

describe('KpiTreeComponent', () => {
    let component: KpiTreeComponent;
    let fixture: ComponentFixture<KpiTreeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [KpiTreeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
