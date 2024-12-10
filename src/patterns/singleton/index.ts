export class Singleton {
  public static instance:any = null;
    
  public static singleton() {
    if(this.instance == null){
      this.instance = new this;
    }

    return this.instance;
  }
}