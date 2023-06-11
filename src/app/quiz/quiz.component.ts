import { Component } from '@angular/core';
import { Language } from '../utils/language';
import { LINKS } from '../utils/links';
import { ActivatedRoute } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  loading = true;
  link: string | null = null;

  startButtonText = 'Start';

  private _subscription = new Subscription();

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _firestore: Firestore,
  ) {
    const lang = this._validateLang(this._route.snapshot.params['lang']);

    switch (lang) {
      case Language.ES:
        this.startButtonText = 'Comenzar';
        break;
      case Language.DE:
      default:
        this.startButtonText = 'Start';
    }

    const itemDoc = doc(this._firestore, 'TrustGame/data');

    this._subscription.add(
      docData(itemDoc).pipe(
        first(),
        tap(async (data) => {
          if (data.first <= data.second) {
            data.first++;

            this.link = LINKS[lang][0];
          } else {
            data.second++;

            this.link = LINKS[lang][1];
          }

          await updateDoc(itemDoc, data);

          this.loading = false;
        }),
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private _validateLang(lang: string | undefined): Language {
    return !lang || !Object.values(Language).includes(lang as Language) ? Language.DE : lang as Language;
  }
}
