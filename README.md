# Installation  :

First, import the MongoDB public GPG key:

``` shell
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

Create a list file for MongoDB:

``` shell
`echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list`
```

Update the package list:

``` shell
sudo apt update
```

Install MongoDB:

``` shell
sudo apt install mongodb-org
```

Start MongoDB service:

``` shell
sudo systemctl start mongod
```

Enable MongoDB to start on system boot

``` shell
`sudo systemctl enable mongod`
```

Verify the installation

``` shell
mongod --version
```

You can check if MongoDB is running with:

``` shell
sudo systemctl status mongod
```


# Connection to DB  :

1) installing mongoose 

``` javascript
npm i @nestjs/mongoose mongoose
```


1) In entry point of app module (app.module.ts)

``` javascript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
imports: [MongooseModule.forRoot(
'mongodb://127.0.0.1:27017/libraryDb'
)],

controllers: [],
providers: [],

})

export class AppModule {}
```


# Confguration env  :

### 1. **Install Required Packages**
Install the `@nestjs/config` package and `dotenv` for environment variable management.

``` javascript
npm install @nestjs/config dotenv
```

### 2. **Set Up Environment Variables**

Create a `.env` file in the root of your project and add the MongoDB URI:

``` env
MONGO_URI=mongodb://127.0.0.1:27017/libraryDb
```


### 3. ****Configure the App to Use Environment Variables****

``` javascript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

  

@Module({

imports: [
ConfigModule.forRoot({
isGlobal: true, // Makes ConfigModule available throughout the app

}),

MongooseModule.forRootAsync({
imports: [ConfigModule],
useFactory: async (configService: ConfigService) => ({
uri: configService.get<string>('MONGO_URI'), // Get MONGO_URI from .env
}),
inject: [ConfigService],
}),
],

controllers: [],
providers: [],
})

export class AppModule {}
```

# MongoDB schema design  :

#### **1. One-to-One**

In a one-to-one relationship, a single document in `A` is associated with a single document in `B`.
#### Approach:

- Use an `ObjectId` reference in one of the schemas to point to the other document.

 Schema Representation:

*Schema A:*

``` javascript
@Schema()
export class A {
  @Prop({ type: Types.ObjectId, ref: 'B' }) // Reference to Schema B
  b: Types.ObjectId;
}
```

*Schema B:*

``` javascript
@Schema()
export class B {
  @Prop({ type: Types.ObjectId, ref: 'A' }) // Reference to Schema A (optional)
  a: Types.ObjectId;
}
```


#### **2. One-to-Many**

In a one-to-many relationship, a single document in `A` is associated with multiple documents in `B`.

#### Approach:

- Use an array of `ObjectId` references in `A` to represent multiple documents in `B`.

#### Schema Representation:

- Schema A:

``` javascript
@Schema()
export class A {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'B' }] }) // Array of references to Schema B
  b: Types.ObjectId[];
}
```

Schema B:

``` javascript
@Schema()
export class B {
  @Prop({ type: Types.ObjectId, ref: 'A' }) // Optional: Reference to Schema A
  a: Types.ObjectId;
}

```


#### **3. Many-to-Many**

In a many-to-many relationship, multiple documents in `A` are associated with multiple documents in `B`.

#### Approach:

- Use an array of `ObjectId` references in both schemas to establish a bidirectional relationship.

#### Schema Representation:

- Schema A:

``` javascript
@Schema()
export class A {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'B' }] }) // Array of references to Schema B
  b: Types.ObjectId[];
}

```

Schema B:

``` javascript
@Schema()
export class B {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'A' }] }) // Array of references to Schema A
  a: Types.ObjectId[];
}
```


### Summary of Key Points:

1. **One-to-One**:
    
    - Use a single `ObjectId` in one or both schemas to reference the other.

1. **One-to-Many**:
    
    - Use an array of `ObjectId` references in the schema that has the "one" side of the relationship.
    - Optionally, add a reference back to the "many" side.

3. **Many-to-Many**:
    
    - Use an array of `ObjectId` references in both schemas.


# MongoDB Mongoose Methods in NestJS  :


| Method              | Parameters                                                                                                                                                          | Use Case                                                                                   | Example (TypeScript)                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `findByIdAndUpdate` | 1. id: The _id of the document.<br>2. update: Update query ($set, $pull, $addToSet, etc.).<br>3. options: { new, upsert, runValidators }.<br>4. callback: Optional. | Use to update a specific document by _id.                                                  | ```typescript<br>const updatedUser = await this.userModel.findByIdAndUpdate( '67892663cd70d929fa6bae36', { $set: { bio: 'Updated bio' } }, { new: true, upsert: false, runValidators: true } );<br>console.log(updatedUser);``` |
| `findByIdAndDelete` | 1. id: The _id of the document.<br>2. options: { projection }.<br>3. callback: Optional callback.                                                                   | Use when you want to delete a specific document by its _id.                                | ```typescript<br>const deletedUser = await this.userModel.findByIdAndDelete( '67892663cd70d929fa6bae36', { projection: { name: 1 } } );<br>console.log(deletedUser);```                                                         |
| `find`              | 1. filter: Query filter.<br>2. projection: Fields to include/exclude.<br>3. options: { sort, skip, limit, collation }.<br>4. callback: Optional callback.           | Use to retrieve multiple documents based on a query (e.g., all users with a certain role). | ```typescript<br>const users = await this.userModel.find( { role: 'admin' }, { name: 1, bio: 1 }, { sort: { name: 1 }, limit: 10 } );<br>console.log(users);```                                                                 |
| `findById`          | 1. id: The _id of the document.<br>2. projection: Fields to include/exclude.<br>3. options: Optional options.<br>4. callback: Optional callback.                    | Use to retrieve a single document when you have its _id.                                   | ```typescript<br>const user = await this.userModel.findById( '67892663cd70d929fa6bae36', { name: 1, bio: 1 } );<br>console.log(user);```                                                                                        |
| `save`              | - Operates directly on a model instance.<br>- No additional parameters.                                                                                             | Use to create a new document or persist changes to an existing one.                        | ```typescript<br>const newUser = new this.userModel({ name: 'John Doe', bio: 'A developer', birthDate: new Date('1990-01-01') });<br>await newUser.save();<br>console.log('User created:', newUser);```                         |
| `updateOne`         | 1. filter: Query filter.<br>2. update: Update query.<br>3. options: { upsert, writeConcern }.<br>4. callback: Optional callback.                                    | Use to update a single document without needing _id but with a query condition.            | ```typescript<br>await this.userModel.updateOne( { name: 'John Doe' }, { $set: { bio: 'Updated bio' } }, { upsert: true } );<br>console.log('User updated');```                                                                 |
| `updateMany`        | 1. filter: Query filter.<br>2. update: Update query.<br>3. options: { upsert, writeConcern }.<br>4. callback: Optional callback.                                    | Use to update multiple documents at once.                                                  | ```typescript<br>await this.userModel.updateMany( { role: 'user' }, { $set: { isActive: false } }, { upsert: false } );<br>console.log('Users updated');```                                                                     |
| `deleteOne`         | 1. filter: Query filter.<br>2. options: Optional options.<br>3. callback: Optional callback.                                                                        | Use to delete a single document without needing _id but with a query condition.            | ```typescript<br>await this.userModel.deleteOne( { name: 'John Doe' } );<br>console.log('User deleted');```                                                                                                                     |
| `deleteMany`        | 1. filter: Query filter.<br>2. options: Optional options.<br>3. callback: Optional callback.                                                                        | Use to delete multiple documents at once.                                                  | ```typescript<br>await this.userModel.deleteMany( { role: 'inactive' } );<br>console.log('Users deleted');```                                                                                                                   |
| `findOne`           | 1. filter: Query filter.<br>2. projection: Fields to include/exclude.<br>3. options: { sort, collation }.<br>4. callback: Optional callback.                        | Use to retrieve the first matching document.                                               | ```typescript<br>const user = await this.userModel.findOne( { name: 'John Doe' }, { name: 1, bio: 1 }, { sort: { name: -1 } } );<br>console.log(user);```                                                                       |





















