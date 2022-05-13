class DAO {
    constructor(model) {
      this.model = model;
    }
    
    pictureUpload = async (filePathName, body) => {
      try {
        const { input } = body;

        const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
        const filePath = filePathName;
        const { filename } = req.file;

        const newPicture = await this.model.create({
          image_url: `${uploadFileDomain}/${filePath}/${filename}`,
          input,
          UserId: req.token.id,
        });

        return newPicture;
      } catch (err) {}
    };
  }

  module.exports = DAO;