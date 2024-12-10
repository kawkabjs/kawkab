export class DependencyInjection {
  public static instance:any = null;
    
  public static inject(){
    if(this.instance == null){
      this.instance = new this;
    }
      
    return this.instance;
  }
}