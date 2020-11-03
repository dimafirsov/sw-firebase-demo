import { Component, ElementRef, ViewChild } from '@angular/core';

import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore/dist/packages/firestore/src/api/timestamp';

import { Observable } from 'rxjs';

export interface INewPost {
    id: string;
    title: string;
    body: string;
    created: Date;
}
export interface INewDoc {
    id: string;
    title: string;
    body: string;
    created: Timestamp;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'sw-firebase-demo';

  @ViewChild('textarea') public textarea: ElementRef;
  @ViewChild('input') public input: ElementRef;

  public posts$: Observable<INewDoc[]>;

  constructor(public firestore: AngularFirestore) {
      this.posts$ = this.firestore.collection('posts').valueChanges() as Observable<INewDoc[]>;
  }

    public onClick() {
        console.log('>>> area', this.textarea.nativeElement.value);
        console.log('>>> input', this.input.nativeElement.value);
        if (this.textarea.nativeElement.value && this.input.nativeElement.value) {
            this.addPost(this.createPost());
            this.clearValues();
        }
    }

    public createPost(): INewPost {
        return {
            id: '',
            title: this.input.nativeElement.value,
            body: this.textarea.nativeElement.value,
            created: new Date(),
        } as INewPost;
    }

    private addPost(post: INewPost): void {
        this.firestore.collection('posts')
                      .add(post)
                      .then(async (doc: DocumentReference) => await doc.update({id: doc.id}));
    }

    private clearValues(): void {
        if (this.textarea && this.input) {
            this.textarea.nativeElement.value = '';
            this.input.nativeElement.value = '';
        }
    }
}
