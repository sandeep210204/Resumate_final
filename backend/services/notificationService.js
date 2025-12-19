const { Notification } = require('../models');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Configure email transporter (use environment variables in production)
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send application submitted notification
  async sendApplicationNotification(userId, job, status) {
    const title = 'Application Submitted Successfully';
    const message = `Your application for ${job.title} at ${job.Company.name} has been submitted and is under review.`;
    
    await this.createNotification(userId, 'application_submitted', title, message, {
      jobId: job.id,
      jobTitle: job.title,
      company: job.Company.name
    });
  }

  // Send status update notification
  async sendStatusUpdateNotification(user, job, newStatus, notes = '') {
    const statusMessages = {
      'under_review': 'Your application is now under review',
      'shortlisted': 'Congratulations! You have been shortlisted',
      'interview_scheduled': 'Interview has been scheduled',
      'interviewed': 'Interview completed - awaiting decision',
      'offered': 'Congratulations! You have received a job offer',
      'hired': 'Congratulations! You have been hired',
      'rejected': 'Application was not successful this time'
    };

    const title = `Application Status Update - ${job.title}`;
    const message = `${statusMessages[newStatus]} for ${job.title} at ${job.Company.name}.${notes ? ` Note: ${notes}` : ''}`;
    
    const notification = await this.createNotification(
      user.id, 
      'status_update', 
      title, 
      message,
      {
        jobId: job.id,
        jobTitle: job.title,
        company: job.Company.name,
        status: newStatus
      },
      newStatus === 'offered' || newStatus === 'hired' ? 'high' : 'medium'
    );

    // Send email for important status updates
    if (['shortlisted', 'interview_scheduled', 'offered', 'hired'].includes(newStatus)) {
      await this.sendEmail(user.email, title, message);
    }

    return notification;
  }

  // Send job match notification
  async sendJobMatchNotification(userId, job, matchScore) {
    if (matchScore < 70) return; // Only notify for high matches

    const title = 'New Job Match Found';
    const message = `We found a ${matchScore}% match for you: ${job.title} at ${job.Company.name}`;
    
    await this.createNotification(userId, 'new_job_match', title, message, {
      jobId: job.id,
      jobTitle: job.title,
      company: job.Company.name,
      matchScore
    });
  }

  // Create in-app notification
  async createNotification(userId, type, title, message, data = {}, priority = 'medium') {
    return await Notification.create({
      UserId: userId,
      type,
      title,
      message,
      data,
      priority
    });
  }

  // Send email notification
  async sendEmail(to, subject, text, html = null) {
    if (!this.emailTransporter || !process.env.SMTP_USER) {
      console.log('Email not configured, skipping email notification');
      return;
    }

    try {
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html: html || `<p>${text}</p>`
      });
      
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }

  // Get user notifications
  async getUserNotifications(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const notifications = await Notification.findAndCountAll({
      where: { UserId: userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    return {
      notifications: notifications.rows,
      pagination: {
        total: notifications.count,
        page: parseInt(page),
        pages: Math.ceil(notifications.count / limit)
      }
    };
  }

  // Mark notifications as read
  async markAsRead(userId, notificationIds) {
    await Notification.update(
      { isRead: true },
      {
        where: {
          UserId: userId,
          id: notificationIds
        }
      }
    );
  }

  // Get unread count
  async getUnreadCount(userId) {
    return await Notification.count({
      where: {
        UserId: userId,
        isRead: false
      }
    });
  }
}

module.exports = new NotificationService();