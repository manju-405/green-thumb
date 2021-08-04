import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'greenthumbtask';
  isEditEnable: boolean;
  commentList = [];
  commentListCopy = [];
  originalData = [];
  totalCount: any;
  USERS_LIMIT= 10;
  activePageId = 1;
  paginationsCount = 0;
  searchData = '';
  isSorted: any;
  showIcon: boolean;
  constructor(private dataService: DataService){
    this.dataService.getJsonData().subscribe((data:any)=> {
      this.totalCount = data.length;
      this.commentListCopy = data;
      this.originalData = data;
      this.changeValues(10);
    },error => {
      console.log(error);
    })

  }
  onEdit() {
    this.isEditEnable = true;
    document.querySelector('input').focus();
  }
  onCancel() {
    this.isEditEnable = false;
  }
  changeValues(count) {
    this.USERS_LIMIT = count;
    this.activePageId = 1;
    this.commentList = this.commentListCopy.slice(0,count);
    this.paginationsCount = Math.ceil(this.commentListCopy.length / this.USERS_LIMIT);
  }
  nextPage() {
    const from = this.activePageId * this.USERS_LIMIT;
    this.activePageId++;
    const to = this.activePageId * this.USERS_LIMIT;
    this.commentList = this.commentListCopy.slice(from,to);
  }

  backPage() {
    let to = (this.activePageId * this.USERS_LIMIT) - this.USERS_LIMIT;
    this.activePageId--;
    let from = (this.activePageId * this.USERS_LIMIT) - this.USERS_LIMIT;
    this.commentList = this.commentListCopy.slice(from,to);
  }

  onSearch() {
    if(this.searchData.trim()) {
      const searchValue = this.searchData.toLowerCase();
      this.commentListCopy = this.originalData.filter(item => {
        return item.name.toLowerCase().includes(searchValue) || item.email.toLowerCase().includes(searchValue) || item.body.toLowerCase().includes(searchValue)
      })
    } else {
      this.commentListCopy = [...this.originalData];
    }
    this.changeValues(this.USERS_LIMIT);
  }
  sortMethod(type:string) {
    this.isSorted = !this.isSorted;
    this.showIcon = true;
    if(type === 'id') {
      if(this.isSorted) {
        this.commentList.sort((a,b) =>{
          return a[type] - b[type];
        })
      }else {
        this.commentList.sort((a,b) =>{
          return b[type] - a[type];
        })
      }
    }else {
      if(this.isSorted) {
        this.commentList.sort((a,b) =>{
          return a[type].toLowerCase() > b[type].toLowerCase() ? 1 : -1;
        })
      }else {
        this.commentList.sort((a,b) =>{
          return a[type].toLowerCase() > b[type].toLowerCase() ? -1 : 1;
        })
      }
    }
  }
}
